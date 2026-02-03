
from flask import Blueprint, request, jsonify
from services.model_service import get_rf_model, get_kmeans_model, get_scaler, get_cluster_map
from services.weather_service import get_weather, get_soil_data
import numpy as np

prediction_bp = Blueprint('prediction', __name__)

def get_advisory(prediction, inputs):
    """
    Rule-based advisory generation.
    """
    crop = prediction['crop']
    N = inputs['N']
    P = inputs['P']
    K = inputs['K']
    rain = inputs['rainfall']
    
    advisory = {
        "fertilizer_tip": "Soil is balanced.",
        "irrigation_tip": "Standard irrigation required.",
        "best_season": "Kharif/Rabi depending on region",
        "soil_note": "Estimated soil values based on location."
    }
    
    # Fertilizer Rules
    if N < 50:
        advisory['fertilizer_tip'] = "High Nitrogen deficiency detected. Recommend applying Urea."
    elif P < 40:
        advisory['fertilizer_tip'] = "Phosphorus levels are low. Consider DAP application."
    elif K < 40:
        advisory['fertilizer_tip'] = "Potassium is low. Apply Muriate of Potash (MOP)."
        
    # Irrigation
    if rain < 50:
        advisory['irrigation_tip'] = "Low rainfall expected. Implement drip irrigation."
    elif rain > 200:
        advisory['irrigation_tip'] = "Heavy rainfall. Ensure proper drainage to avoid water logging."
        
    # Crop specific (Simple example)
    if crop.lower() in ['rice', 'jute']:
        advisory['best_season'] = "Kharif (Monsoon)"
    elif crop.lower() in ['wheat', 'chickpea']:
        advisory['best_season'] = "Rabi (Winter)"
        
    return advisory

@prediction_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        lat = data.get('latitude')
        lon = data.get('longitude')
        
        if not lat or not lon:
            return jsonify({"error": "Latitude and Longitude required"}), 400
            
        # 1. Fetch Environment Data
        weather = get_weather(lat, lon)
        soil = get_soil_data(lat, lon)
        
        # Prepare Input Vector [N, P, K, Temp, Hum, pH, Rain]
        input_dict = {**soil, **weather}
        features = [
            input_dict['N'],
            input_dict['P'],
            input_dict['K'],
            input_dict['temperature'],
            input_dict['humidity'],
            input_dict['ph'],
            input_dict['rainfall']
        ]
        
        features_arr = np.array([features])
        
        # 2. Load Models
        rf = get_rf_model()
        kmeans = get_kmeans_model()
        scaler = get_scaler()
        cluster_map = get_cluster_map()
        
        if not rf or not scaler:
            return jsonify({"error": "Models not loaded"}), 500
            
        # 3. Preprocess
        features_scaled = scaler.transform(features_arr)
        
        # 4. Hybrid Prediction Logic
        # A. Random Forest Probabilities
        rf_probs = rf.predict_proba(features_scaled)[0]
        rf_classes = rf.classes_
        
        rf_score_map = {cls: prob for cls, prob in zip(rf_classes, rf_probs)}
        
        # B. Clustering Membership
        # Distance to centroids
        distances = kmeans.transform(features_scaled)[0]
        # Invert distance to get similarity/membership (closer = higher score)
        # Add small epsilon to avoid div by zero
        with np.errstate(divide='ignore'):
            inv_dist = 1.0 / (distances + 1e-4)
        membership_weights = inv_dist / np.sum(inv_dist) # Normalize to sum to 1
        
        # C. Fusion
        # We need a score for each label.
        # Cluster contribution = sum ( membership_of_cluster_i * prob_label_in_cluster_i )
        
        fusion_scores = {}
        all_labels = rf_classes 
        
        for label in all_labels:
            rf_conf = rf_score_map.get(label, 0.0)
            
            cluster_conf = 0.0
            for cluster_idx, weight in enumerate(membership_weights):
                # How prevalent is this label in this cluster?
                # cluster_map is dict of dicts: cluster_map[cluster_idx][label]
                if cluster_idx in cluster_map and label in cluster_map[cluster_idx]:
                     prob_in_cluster = cluster_map[cluster_idx][label]
                     cluster_conf += weight * prob_in_cluster
            
            # Weighted Formula: 0.6 * RF + 0.4 * Cluster
            final_score = (0.6 * rf_conf) + (0.4 * cluster_conf)
            fusion_scores[label] = final_score
            
        # Sort and get Top 3
        sorted_crops = sorted(fusion_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        
        recommendations = []
        for crop, score in sorted_crops:
            recommendations.append({
                "crop": crop,
                "confidence": f"{round(score * 100, 1)}%"
            })
            
        # 5. Advisory
        top_crop = recommendations[0]['crop']
        advisory = get_advisory({"crop": top_crop}, input_dict)
        
        # 6. Response
        response = {
            "project": "Smart Crop Advisory System",
            "location": f"Lat: {lat}, Lon: {lon}",
            "inputs": input_dict,
            "recommendations": recommendations,
            "advisory": advisory,
            "model_type": "Hybrid Random Forest + KMeans Membership"
        }
        
        return jsonify(response)

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500
