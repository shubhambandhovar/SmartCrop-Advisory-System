
import os
import joblib
import numpy as np

# Load artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, '../../model')

try:
    rf_model = joblib.load(os.path.join(MODEL_DIR, 'rf_model.pkl'))
    kmeans_model = joblib.load(os.path.join(MODEL_DIR, 'kmeans.pkl'))
    scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl'))
    cluster_map = joblib.load(os.path.join(MODEL_DIR, 'cluster_map.pkl'))
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    rf_model = None
    kmeans_model = None
    scaler = None
    cluster_map = None

def get_rf_model():
    return rf_model

def get_kmeans_model():
    return kmeans_model

def get_scaler():
    return scaler

def get_cluster_map():
    return cluster_map
