
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
    // Top clusters
    const topClusters = result.top_clusters;

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

            {/* Top Clusters */}
            {topClusters && (
                <div className="feature-section">
                    <h3>📊 Top 3 Matching Clusters</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                        {topClusters.map((cluster, idx) => (
                            <div key={idx} style={{ padding: '0.8rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong>Cluster {cluster.cluster_index}</strong>
                                    <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>
                                        Score: {(cluster.score * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                    Dominant Crops: {cluster.dominant_crops.join(', ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Standard Scaler Transformation Table */}
            {result.inputs && result.inputs_scaled && (
                <div className="feature-section">
                    <h3>⚖️ Standard Scaler Validation</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                        Before passing your farm data to our models, we standardize the numbers (mean=0, std=1) so features like Rainfall don't overshadow pH.
                    </p>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f1f8f5' }}>
                                    <th style={{ padding: '8px' }}>Feature</th>
                                    <th style={{ padding: '8px' }}>Raw Value</th>
                                    <th style={{ padding: '8px' }}>Scaled Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'].map((feat, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{feat.toUpperCase()}</td>
                                        <td style={{ padding: '8px' }}>{result.inputs[feat]?.toFixed(2) || result.inputs[feat]}</td>
                                        <td style={{ padding: '8px', color: 'var(--primary-green)' }}>{result.inputs_scaled[feat]?.toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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
