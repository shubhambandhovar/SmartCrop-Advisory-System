
import React from 'react';


const PredictionResult = ({ result }) => {
    if (!result) return null;

    // SHAP explainability
    const shap = result.explainability;
    // Crop calendar
    const cropCalendar = result.crop_calendar;
    // Pest/disease alert
    const pestAlert = result.pest_disease_alert;
    // Soil health analytics
    const soilAnalysis = result.soil_analysis;

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.2rem' }}>🌱 Recommended Crops</h2>
            <div className="grid">
                {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="stat-box" style={{ borderColor: idx === 0 ? 'var(--primary-green)' : '#eee', boxShadow: idx === 0 ? '0 2px 8px #d2f5e3' : 'none', background: idx === 0 ? '#f6fff9' : '#fff' }}>
                        <div className="stat-label">Rank {idx + 1}</div>
                        <div className="stat-value" style={{ fontWeight: 600, fontSize: '1.3rem', color: 'var(--primary-green)' }}>{rec.crop_localized || rec.crop}</div>
                        {rec.crop_localized && rec.crop_localized !== rec.crop && (
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{rec.crop}</div>
                        )}
                        <div className="confidence-bar" style={{ background: '#e0f7ef', height: 8, borderRadius: 4, margin: '8px 0' }}>
                            <div
                                className="confidence-fill"
                                style={{ width: rec.confidence, background: 'linear-gradient(90deg, #4caf50, #a5d6a7)', height: 8, borderRadius: 4 }}
                            ></div>
                        </div>
                        <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#666' }}>
                            Confidence: {rec.confidence}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem', color: '#888' }}>
                Model: {result.model_type}
            </div>

            {/* SHAP Explainability */}
            {shap && (
                <div className="card" style={{ marginTop: '2rem', background: '#f8f8f8', borderLeft: '4px solid #4caf50' }}>
                    <h3 style={{ marginBottom: 8 }}>🔎 Why these crops?</h3>
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                        {shap.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: 4 }}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Crop Calendar & Pest/Disease Alert */}
            {(cropCalendar || pestAlert) && (
                <div className="card" style={{ marginTop: '2rem', background: '#f8f8f8', borderLeft: '4px solid #2196f3' }}>
                    <h3 style={{ marginBottom: 8 }}>📅 Crop Calendar & Alerts</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                        {cropCalendar && (
                            <div>
                                <div><strong>🌱 Planting:</strong> {cropCalendar.planting?.join(', ') || '-'}</div>
                                <div><strong>🌾 Harvest:</strong> {cropCalendar.harvest?.join(', ') || '-'}</div>
                            </div>
                        )}
                        {pestAlert && (
                            <div style={{ color: pestAlert.includes('No major') ? '#4caf50' : '#e65100', fontWeight: 500 }}>
                                <strong>🐛 Pest/Disease Alert:</strong> {pestAlert}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Soil Health Analytics */}
            {soilAnalysis && (
                <div className="card" style={{ marginTop: '2rem', background: '#f8f8f8', borderLeft: '4px solid #ff9800' }}>
                    <h3 style={{ marginBottom: 8 }}>🧪 Soil Health Analysis</h3>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.1rem' }}><strong>Score:</strong> <span style={{ color: '#4caf50', fontWeight: 600 }}>{soilAnalysis.soil_score} / 100</span></div>
                        <div style={{ fontSize: '1.1rem' }}><strong>Quality:</strong> <span style={{ color: soilAnalysis.soil_quality === 'Good' ? '#4caf50' : soilAnalysis.soil_quality === 'Moderate' ? '#ff9800' : '#e65100', fontWeight: 600 }}>{soilAnalysis.soil_quality}</span></div>
                    </div>
                    {soilAnalysis.soil_recommendations && soilAnalysis.soil_recommendations.length > 0 && (
                        <div style={{ marginTop: '0.8rem' }}>
                            <strong>Recommendations:</strong>
                            <ul style={{ paddingLeft: 20, margin: 0 }}>
                                {soilAnalysis.soil_recommendations.map((rec, idx) => (
                                    <li key={idx} style={{ marginBottom: 4 }}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PredictionResult;
