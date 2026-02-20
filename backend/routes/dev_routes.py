import os
import json
from flask import Blueprint, jsonify

dev_bp = Blueprint('dev', __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DASHBOARD_DATA_PATH = os.path.join(BASE_DIR, '../../model/dashboard_data.json')

def load_dashboard_data():
    try:
        with open(DASHBOARD_DATA_PATH, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading dashboard data: {e}")
        return None

@dev_bp.route('/class-distribution', methods=['GET'])
def get_class_distribution():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["class_distribution"])

@dev_bp.route('/correlation-matrix', methods=['GET'])
def get_correlation_matrix():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["correlation_matrix"])

@dev_bp.route('/model-comparison', methods=['GET'])
def get_model_comparison():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["model_comparison"])

@dev_bp.route('/cross-validation', methods=['GET'])
def get_cross_validation():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["cross_validation"])

@dev_bp.route('/feature-importance', methods=['GET'])
def get_feature_importance():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["feature_importance"])

@dev_bp.route('/cluster-visualization', methods=['GET'])
def get_cluster_visualization():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["cluster_visualization"])

@dev_bp.route('/membership-scores', methods=['GET'])
def get_membership_scores():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["membership_scores"])

@dev_bp.route('/shap-summary', methods=['GET'])
def get_shap_summary():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["shap_summary"])

@dev_bp.route('/boxplot-features', methods=['GET'])
def get_boxplot_features():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["boxplot_features"])

@dev_bp.route('/kmeans-counts', methods=['GET'])
def get_kmeans_counts():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["kmeans_cluster_counts"])

@dev_bp.route('/cluster-map', methods=['GET'])
def get_cluster_map():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["cluster_map_heatmap"])

@dev_bp.route('/feature-importance-adaboost', methods=['GET'])
def get_feature_importance_adaboost():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["feature_importance_adaboost"])

@dev_bp.route('/feature-importance-gb', methods=['GET'])
def get_feature_importance_gb():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["feature_importance_gradient_boosting"])

@dev_bp.route('/shap-local', methods=['GET'])
def get_shap_local():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["shap_local"])

@dev_bp.route('/confusion-matrix', methods=['GET'])
def get_confusion_matrix():
    data = load_dashboard_data()
    if not data: return jsonify({"error": "Data not found"}), 500
    return jsonify(data["confusion_matrix"])

from flask import send_from_directory

@dev_bp.route('/plots/<filename>', methods=['GET'])
def get_plot(filename):
    plots_dir = os.path.join(BASE_DIR, '../../model/plots')
    # Prevent directory traversal
    if ".." in filename or filename.startswith("/"):
        return jsonify({"error": "Invalid filename"}), 400
    try:
        return send_from_directory(plots_dir, filename)
    except Exception as e:
        return jsonify({"error": "File not found"}), 404

@dev_bp.route('/results/<filename>', methods=['GET'])
def get_result(filename):
    model_dir = os.path.join(BASE_DIR, '../../model')
    # Prevent directory traversal
    if ".." in filename or filename.startswith("/"):
        return jsonify({"error": "Invalid filename"}), 400
    if filename.endswith(".txt") or filename.endswith(".md"):
        try:
           with open(os.path.join(model_dir, filename), 'r', encoding='utf-8') as f:
               content = f.read()
           return jsonify({"content": content})
        except Exception as e:
           return jsonify({"error": "File not found"}), 404
    return jsonify({"error": "Unauthorized file format"}), 403

