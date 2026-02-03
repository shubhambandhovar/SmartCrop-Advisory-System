
import React from 'react';

const SoilCard = ({ inputs }) => {
    if (!inputs) return null;

    return (
        <div className="card">
            <h3>Soil Analysis (Estimated)</h3>
            <div className="grid">
                <div className="stat-box">
                    <div className="stat-label">Nitrogen (N)</div>
                    <div className="stat-value">{inputs.N}</div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Phosphorus (P)</div>
                    <div className="stat-value">{inputs.P}</div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Potassium (K)</div>
                    <div className="stat-value">{inputs.K}</div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">pH Level</div>
                    <div className="stat-value">{inputs.ph}</div>
                </div>
            </div>
        </div>
    );
};

export default SoilCard;
