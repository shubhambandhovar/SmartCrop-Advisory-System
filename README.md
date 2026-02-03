
# Smart Crop Advisory System 🌱

A production-grade Capstone Project integrating Machine Learning, Hybrid Clustering, and Real-time Weather/Soil Analytics to provide intelligent crop recommendations for farmers.

## 🚀 Features

- **Hybrid AI Model**: Combines Random Forest (Supervised) + K-Means Clustering (Unsupervised) for robust predictions.
- **Real-Time Integration**: Fetches live weather data via OpenWeatherMap API and estimates regional soil parameters.
- **Smart Location Search**: Google-like autocomplete for cities using OpenStreetMap.
- **Agricultural Advisory**: Rule-based expert system for fertilizer, irrigation, and seasonal guidance.
- **Production Architecture**: Flask REST API + React (Vite) Frontend + Modular Codebase.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, CSS Modules / Vanilla CSS
- **Backend**: Python, Flask, Flask-CORS
- **ML/AI**: Scikit-Learn, Pandas, NumPy, Joblib (RF + KMeans)
- **Data**: Crop Recommendation Dataset (N, P, K, Temp, Humidity, pH, Rain)

## 📂 Folder Structure

```
smart-crop-advisory-system/
│
├── backend/            # Flask REST API
│   ├── app.py          # Entry point
│   ├── routes/         # API endpoints
│   ├── services/       # Logic layer (Model, Weather, Soil)
│   └── model/          # Artifacts loader
│
├── model/              # ML Pipeline
│   ├── train_model.py  # training script
│   └── *.pkl           # Saved models
│
├── frontend/           # React App
│   ├── src/
│   │   ├── components/
│   │   └── services/
│
├── dataset/            # Data source
└── requirements.txt    # Python deps
```

## ⚙️ Setup & Installation

### 1. Backend Setup

```bash
cd smart-crop-advisory-system
# Install dependencies
python -m pip install -r requirements.txt

# Run Training Pipeline (Generates .pkl files)
python model/train_model.py

# Start Flask Server
cd backend
python app.py
```
*Server runs on http://localhost:5000*

### 2. Frontend Setup

```bash
cd smart-crop-advisory-system/frontend
# Install dependencies
npm install

# Start Dev Server
npm run dev
```
*App runs on http://localhost:5173*

## 📊 Hybrid Logic Explanation

The system uses a weighted fusion score:
`FinalScore = (0.6 * RF_Probability) + (0.4 * Cluster_Membership_Score)`

1. **Random Forest** provides high-accuracy classification based on labeled training data.
2. **K-Means Clustering** identifies hidden patterns in soil-weather data. Samples closer to a cluster centroid get a higher membership score for crops dominant in that cluster.
3. This hybrid approach ensures that even if a specific crop wasn't the top classifier pick, if the environmental conditions strongly match a cluster where that crop thrives, it gets boosted.

## 📝 Disclaimer
Soil values are estimated based on regional averages for demonstration purposes in this Capstone. In a real-world deployment, this would connect to a Digital Soil Map (DSM) API.

---
**Capstone Project 2025**

