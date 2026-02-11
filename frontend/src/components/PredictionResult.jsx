
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
            <h2>Recommended Crops</h2>
            <div className="grid">
                {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="stat-box" style={{ borderColor: idx === 0 ? 'var(--primary-green)' : '#eee' }}>
                        <div className="stat-label">Rank {idx + 1}</div>
                        <div className="stat-value">{rec.crop_localized || rec.crop}</div>
                        {rec.crop_localized && rec.crop_localized !== rec.crop && (
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{rec.crop}</div>
                        )}
                        <div className="confidence-bar">
                            <div
                                className="confidence-fill"
                                style={{ width: rec.confidence }}
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
                <div className="card" style={{ marginTop: '1.5rem', background: '#f8f8f8' }}>
                    <h3>Why these crops? (Explainability)</h3>
                    <ul>
                        {shap.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Crop Calendar & Pest/Disease Alert */}
            {(cropCalendar || pestAlert) && (
                <div className="card" style={{ marginTop: '1.5rem', background: '#f8f8f8' }}>
                    <h3>Crop Calendar & Alerts</h3>
                    {cropCalendar && (
                        <div><strong>Planting:</strong> {cropCalendar.planting?.join(', ')}<br/>
                        <strong>Harvest:</strong> {cropCalendar.harvest?.join(', ')}</div>
                    )}
                    {pestAlert && (
                        <div style={{ marginTop: '0.5rem' }}><strong>Pest/Disease Alert:</strong> {pestAlert}</div>
                    )}
                </div>
            )}

            {/* Soil Health Analytics */}
            {soilAnalysis && (
                <div className="card" style={{ marginTop: '1.5rem', background: '#f8f8f8' }}>
                    <h3>Soil Health Analysis</h3>
                    <div><strong>Score:</strong> {soilAnalysis.soil_score} / 100</div>
                    <div><strong>Quality:</strong> {soilAnalysis.soil_quality}</div>
                    {soilAnalysis.soil_recommendations && soilAnalysis.soil_recommendations.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <strong>Recommendations:</strong>
                            <ul>
                                {soilAnalysis.soil_recommendations.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
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
