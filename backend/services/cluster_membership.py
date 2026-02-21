"""
Cluster Membership Service for Smart Crop Advisory System

This module implements a fuzzy clustering-based membership scoring mechanism.
It enhances the traditional supervised classification (Random Forest) with unsupervised
K-Means clustering to provide soft clustering membership.

MATHEMATICAL INTUITION & EXPLANATION:
1. Why Fuzzy Membership is used:
   Hard clustering assigns a sample to exactly one cluster, which may miss the nuances of 
   samples lying near cluster boundaries. Fuzzy membership (soft clustering) assigns 
   a membership probability to ALL clusters based on the inverse of their distances. 
   This avoids penalizing crops that share similar soil/weather characteristics with 
   neighboring clusters, increasing overall robustness.

2. How (1 / distance) × proportion_category improves accuracy:
   - (1 / distance) ensures that closer clusters have a higher influence (weight) 
     on the final score.
   - proportion_category (the distribution of crops inside that cluster) provides 
     the empirical probability of a crop given that cluster.
   Multiplying these yields a weighted probability distribution. This logic bridges 
   the gap between pure distance-based similarity and actual label distribution, 
   acting as a localized probabilistic voting mechanism. By combining this unsupervised
   structural insight with Random Forest probabilities, we achieve better explainability 
   and accuracy for boundary cases.
"""

import numpy as np

def compute_cluster_distances(features_scaled, kmeans):
    """
    STEP 2: Distance Computation
    Computes Euclidean distance from the test sample to EACH cluster centroid.
    
    Args:
        features_scaled (np.ndarray): Scaled input features of shape (1, n_features).
        kmeans (sklearn.cluster.KMeans): Trained K-Means model.
        
    Returns:
        np.ndarray: Array of distances to each centroid.
    """
    # Transform method of K-Means returns Euclidean distances to cluster centers
    distances = kmeans.transform(features_scaled)[0]
    return distances


def compute_fuzzy_membership_scores(distances, cluster_map, all_labels):
    """
    STEP 3: Fuzzy Membership Calculation (MANDATORY)
    Calculates soft membership scores by combining inverse distance weights
    with the proportion of crop labels present in each cluster.
    
    Formula: score_crop += (1 / distance_to_cluster) * proportion_crop_in_cluster
    
    Args:
        distances (np.ndarray): Distances to each cluster centroid.
        cluster_map (dict): Mapping of cluster_id -> {crop_label: proportion}.
        all_labels (list/np.ndarray): Array of all possible crop labels.
        
    Returns:
        tuple: (membership_scores dict, cluster_weights dict)
    """
    score_crop = {label: 0.0 for label in all_labels}
    
    # Calculate inverse distances. Add small epsilon (1e-6) to avoid division by zero 
    # in case a point lies exactly on a centroid.
    with np.errstate(divide='ignore'):
        inv_distances = 1.0 / (distances + 1e-6)
        
    cluster_weights = {}
        
    for cluster_id, inv_dist in enumerate(inv_distances):
        cluster_weights[int(cluster_id)] = float(inv_dist)
        
        # Safely access the cluster distribution (handle both int and string keys)
        str_id = str(cluster_id)
        if cluster_id in cluster_map:
            prob_map = cluster_map[cluster_id]
        elif str_id in cluster_map:
            prob_map = cluster_map[str_id]
        else:
            prob_map = {}
            
        # Accumulate the scores for each crop
        for label in all_labels:
            proportion = float(prob_map.get(label, 0.0))
            score_crop[label] += float(inv_dist) * proportion
            
    # Normalize scores so that the total sum = 1 (Soft Membership)
    total_score = sum(score_crop.values())
    if total_score > 0:
        for label in score_crop:
            score_crop[label] = float(score_crop[label] / total_score)
            
    return score_crop, cluster_weights


def combine_with_rf_probabilities(rf_probs, rf_classes, membership_scores):
    """
    STEP 4: Model Fusion (Weighted Ensemble)
    Combines Supervised (Random Forest) and Unsupervised (Fuzzy Clustering) scores.
    
    Final Score = (0.7 * RandomForestProbability) + (0.3 * ClusterMembershipScore)
    
    Args:
        rf_probs (np.ndarray): Probability array from Random Forest for a sample.
        rf_classes (np.ndarray): Array of class labels matching rf_probs.
        membership_scores (dict): Fuzzy membership scores from unsupervised clustering.
        
    Returns:
        tuple: (Top-3 recommended crops list, fusion_scores dict)
    """
    rf_score_map = {cls: prob for cls, prob in zip(rf_classes, rf_probs)}
    
    fusion_scores = {}
    for label in rf_classes:
        rf_prob = rf_score_map.get(label, 0.0)
        cluster_score = membership_scores.get(label, 0.0)
        
        # Weighted Ensemble as per defined ratio
        final_score = (0.7 * rf_prob) + (0.3 * cluster_score)
        fusion_scores[label] = final_score
        
    # Sort crops based on Final Score in descending order, then pick Top-3
    sorted_crops = sorted(fusion_scores.items(), key=lambda x: x[1], reverse=True)[:3]
    
    return sorted_crops, fusion_scores
