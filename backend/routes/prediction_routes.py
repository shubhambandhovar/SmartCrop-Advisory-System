
from flask import Blueprint, request, jsonify
from services.model_service import get_rf_model, get_kmeans_model, get_scaler, get_cluster_map
from services.weather_service import get_weather, get_soil_data
import numpy as np

prediction_bp = Blueprint('prediction', __name__)

SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "es": "Spanish",
    "fr": "French",
}

TRANSLATIONS = {
    "hi": {
        "Soil is balanced.": "मिट्टी संतुलित है।",
        "Standard irrigation required.": "सामान्य सिंचाई आवश्यक है।",
        "Kharif/Rabi depending on region": "क्षेत्र के अनुसार खरीफ/रबी।",
        "Estimated soil values based on location.": "स्थान के आधार पर मिट्टी के अनुमानित मान।",
        "High Nitrogen deficiency detected. Recommend applying Urea.": "नाइट्रोजन की कमी पाई गई। यूरिया डालने की सलाह है।",
        "Phosphorus levels are low. Consider DAP application.": "फॉस्फोरस कम है। डीएपी का प्रयोग करें।",
        "Potassium is low. Apply Muriate of Potash (MOP).": "पोटैशियम कम है। म्यूरेट ऑफ पोटाश (MOP) डालें।",
        "Low rainfall expected. Implement drip irrigation.": "कम वर्षा की संभावना है। ड्रिप सिंचाई अपनाएं।",
        "Heavy rainfall. Ensure proper drainage to avoid water logging.": "अधिक वर्षा है। जलभराव रोकने के लिए निकासी सुनिश्चित करें।",
        "Kharif (Monsoon)": "खरीफ (मानसून)",
        "Rabi (Winter)": "रबी (सर्दी)",
        "rice": "धान",
        "maize": "मक्का",
        "chickpea": "चना",
        "kidneybeans": "राजमा",
        "pigeonpeas": "अरहर",
        "mothbeans": "मठ",
        "mungbean": "मूंग",
        "blackgram": "उड़द",
        "lentil": "मसूर",
        "pomegranate": "अनार",
        "banana": "केला",
        "mango": "आम",
        "grapes": "अंगूर",
        "watermelon": "तरबूज",
        "muskmelon": "खरबूजा",
        "apple": "सेब",
        "orange": "संतरा",
        "papaya": "पपीता",
        "coconut": "नारियल",
        "cotton": "कपास",
        "jute": "जूट",
        "coffee": "कॉफी",
    },
    "mr": {
        "Soil is balanced.": "माती संतुलित आहे.",
        "Standard irrigation required.": "नेहमीची सिंचन पद्धत आवश्यक आहे.",
        "Kharif/Rabi depending on region": "प्रदेशानुसार खरीप/रब्बी.",
        "Estimated soil values based on location.": "स्थानावर आधारित मातीचे अंदाजे मूल्य.",
        "High Nitrogen deficiency detected. Recommend applying Urea.": "नायट्रोजनची कमतरता आढळली. युरिया वापरण्याची शिफारस.",
        "Phosphorus levels are low. Consider DAP application.": "फॉस्फरस कमी आहे. डीएपी वापरा.",
        "Potassium is low. Apply Muriate of Potash (MOP).": "पोटॅशियम कमी आहे. म्युरिएट ऑफ पोटॅश (MOP) वापरा.",
        "Low rainfall expected. Implement drip irrigation.": "पावसाचे प्रमाण कमी अपेक्षित आहे. ठिबक सिंचन वापरा.",
        "Heavy rainfall. Ensure proper drainage to avoid water logging.": "जास्त पाऊस आहे. पाणी साचू नये म्हणून निचरा सुनिश्चित करा.",
        "Kharif (Monsoon)": "खरीप (पावसाळा)",
        "Rabi (Winter)": "रब्बी (हिवाळा)",
        "rice": "तांदूळ",
        "maize": "मका",
        "chickpea": "हरभरा",
        "kidneybeans": "राजमा",
        "pigeonpeas": "तूर",
        "mothbeans": "मटकी",
        "mungbean": "मुग",
        "blackgram": "उडीद",
        "lentil": "मसूर",
        "pomegranate": "डाळिंब",
        "banana": "केळी",
        "mango": "आंबा",
        "grapes": "द्राक्षे",
        "watermelon": "कलिंगड",
        "muskmelon": "खरबूज",
        "apple": "सफरचंद",
        "orange": "संत्रे",
        "papaya": "पपई",
        "coconut": "नारळ",
        "cotton": "कापूस",
        "jute": "पटसन",
        "coffee": "कॉफी",
    },
    "es": {
        "Soil is balanced.": "El suelo está equilibrado.",
        "Standard irrigation required.": "Se requiere riego estándar.",
        "Kharif/Rabi depending on region": "Kharif/Rabi según la región.",
        "Estimated soil values based on location.": "Valores del suelo estimados según la ubicación.",
        "High Nitrogen deficiency detected. Recommend applying Urea.": "Se detectó alta deficiencia de nitrógeno. Se recomienda aplicar urea.",
        "Phosphorus levels are low. Consider DAP application.": "Los niveles de fósforo son bajos. Considere aplicar DAP.",
        "Potassium is low. Apply Muriate of Potash (MOP).": "El potasio es bajo. Aplique muriato de potasa (MOP).",
        "Low rainfall expected. Implement drip irrigation.": "Se espera poca lluvia. Implemente riego por goteo.",
        "Heavy rainfall. Ensure proper drainage to avoid water logging.": "Lluvia intensa. Asegure un buen drenaje para evitar encharcamientos.",
        "Kharif (Monsoon)": "Kharif (Monzón)",
        "Rabi (Winter)": "Rabi (Invierno)",
    },
    "fr": {
        "Soil is balanced.": "Le sol est équilibré.",
        "Standard irrigation required.": "Une irrigation standard est nécessaire.",
        "Kharif/Rabi depending on region": "Kharif/Rabi selon la région.",
        "Estimated soil values based on location.": "Valeurs du sol estimées selon l'emplacement.",
        "High Nitrogen deficiency detected. Recommend applying Urea.": "Forte carence en azote détectée. L'application d'urée est recommandée.",
        "Phosphorus levels are low. Consider DAP application.": "Le niveau de phosphore est faible. Envisagez l'application de DAP.",
        "Potassium is low. Apply Muriate of Potash (MOP).": "Le potassium est faible. Appliquez du muriate de potasse (MOP).",
        "Low rainfall expected. Implement drip irrigation.": "Faibles précipitations attendues. Mettez en place une irrigation goutte à goutte.",
        "Heavy rainfall. Ensure proper drainage to avoid water logging.": "Fortes pluies. Assurez un bon drainage pour éviter la stagnation de l'eau.",
        "Kharif (Monsoon)": "Kharif (Mousson)",
        "Rabi (Winter)": "Rabi (Hiver)",
    },
}


def translate_text(text, lang):
    if lang == "en":
        return text
    return TRANSLATIONS.get(lang, {}).get(text, text)


def localize_advisory(advisory, lang):
    return {key: translate_text(value, lang) for key, value in advisory.items()}


def localize_crop_name(crop_name, lang):
    return translate_text(crop_name, lang)

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
        requested_lang = (data.get('lang') or 'en').lower().strip()
        lang = requested_lang if requested_lang in SUPPORTED_LANGUAGES else 'en'
        
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
                "crop_localized": localize_crop_name(crop, lang),
                "confidence": f"{round(score * 100, 1)}%"
            })
            
        # 5. Advisory
        top_crop = recommendations[0]['crop']
        advisory = get_advisory({"crop": top_crop}, input_dict)
        advisory_localized = localize_advisory(advisory, lang)
        
        # 6. Response
        response = {
            "project": "Smart Crop Advisory System",
            "location": f"Lat: {lat}, Lon: {lon}",
            "language": {
                "requested": requested_lang,
                "applied": lang,
                "supported": SUPPORTED_LANGUAGES
            },
            "inputs": input_dict,
            "recommendations": recommendations,
            "advisory": advisory_localized,
            "model_type": "Hybrid Random Forest + KMeans Membership"
        }
        
        return jsonify(response)

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500
