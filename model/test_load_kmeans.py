import joblib

try:
    kmeans = joblib.load('model/kmeans.pkl')
    print('KMeans model loaded successfully:', kmeans)
except Exception as e:
    print('Error loading kmeans.pkl:', e)
