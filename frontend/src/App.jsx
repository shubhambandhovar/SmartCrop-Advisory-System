
import React, { useState } from 'react';
import LocationSearch from './components/LocationSearch';
import WeatherCard from './components/WeatherCard';
import SoilCard from './components/SoilCard';
import PredictionResult from './components/PredictionResult';
import AdvisoryPanel from './components/AdvisoryPanel';
import Loader from './components/Loader';
import api from './services/api';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/predict', {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch prediction. Ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <header>
        <h1>Smart Crop Advisory</h1>
        <p>AI-Powered Precision Agriculture System</p>
      </header>

      <div className="card">
        <h3>1. Select Location</h3>
        <LocationSearch onLocationSelect={setSelectedLocation} />
        {selectedLocation && (
          <div style={{ marginTop: '1rem', color: 'var(--primary-green)' }}>
            Selected: <strong>{selectedLocation.name}</strong>
          </div>
        )}

        <br />
        <button
          onClick={handlePredict}
          disabled={!selectedLocation || loading}
          style={{ width: '100%', maxWidth: '300px' }}
        >
          {loading ? 'Analyzing Soil & Weather...' : 'Get Recommendation'}
        </button>
      </div>

      {loading && <Loader />}

      {error && (
        <div className="card" style={{ borderColor: 'red', color: 'red' }}>
          {error}
        </div>
      )}

      {result && (
        <>
          <WeatherCard inputs={result.inputs} />
          <SoilCard inputs={result.inputs} />
          <PredictionResult result={result} />
          <AdvisoryPanel advisory={result.advisory} />
        </>
      )}

      <footer style={{ marginTop: '4rem', color: '#999' }}>
        &copy; 2024 Smart Crop Advisory System | Capstone Project
      </footer>
    </div>
  );
}

export default App;
