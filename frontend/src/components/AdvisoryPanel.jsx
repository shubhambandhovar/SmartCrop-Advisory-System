
import React from 'react';

const AdvisoryPanel = ({ advisory }) => {
    if (!advisory) return null;

    return (
        <div className="card advisory-panel">
            <h2>Agricultural Advisory</h2>
            <div className="grid">
                <div className="advisory-item">
                    <h4>🧪 Fertilizer</h4>
                    <p>{advisory.fertilizer_tip}</p>
                </div>
                <div className="advisory-item">
                    <h4>💧 Irrigation</h4>
                    <p>{advisory.irrigation_tip}</p>
                </div>
                <div className="advisory-item">
                    <h4>📅 Best Season</h4>
                    <p>{advisory.best_season}</p>
                </div>
                <div className="advisory-item">
                    <h4>🌱 Soil Note</h4>
                    <p>{advisory.soil_note}</p>
                </div>
            </div>
        </div>
    );
};

export default AdvisoryPanel;
