
import React from 'react';

const PredictionResult = ({ result }) => {
    if (!result) return null;

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
        </div>
    );
};

export default PredictionResult;
