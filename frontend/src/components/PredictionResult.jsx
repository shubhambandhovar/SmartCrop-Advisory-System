
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
                <div className="feature-section explain">
                    <h3>🔎 Why these crops?</h3>
                    <ul>
                        {shap.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Crop Calendar & Pest/Disease Alert */}
            {(cropCalendar || pestAlert) && (
                <div className="feature-section">
                    <h3>📅 Crop Calendar & Alerts</h3>
                    <div className="feature-row">
                        {cropCalendar && (
                            <div>
                                <div><span className="feature-label">🌱 Planting:</span> <span className="feature-value">{cropCalendar.planting?.join(', ') || '-'}</span></div>
                                <div><span className="feature-label">🌾 Harvest:</span> <span className="feature-value">{cropCalendar.harvest?.join(', ') || '-'}</span></div>
                            </div>
                        )}
                        {pestAlert && (
                            <div className={`pest-alert${pestAlert.includes('No major') ? '' : ' warning'}`}>
                                🐛 <span className="feature-label">Pest/Disease Alert:</span> {pestAlert}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Soil Health Analytics */}
            {soilAnalysis && (
                <div className="feature-section soil">
                    <h3>🧪 Soil Health Analysis</h3>
                    <div className="feature-row">
                        <div className="soil-score">Score: {soilAnalysis.soil_score} / 100</div>
                        <div className={`soil-quality ${soilAnalysis.soil_quality.toLowerCase()}`}>Quality: {soilAnalysis.soil_quality}</div>
                    </div>
                    {soilAnalysis.soil_recommendations && soilAnalysis.soil_recommendations.length > 0 && (
                        <div style={{ marginTop: '0.8rem', width: '100%' }}>
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
