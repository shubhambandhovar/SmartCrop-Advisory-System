
import React from 'react';

const WeatherCard = ({ inputs }) => {
    if (!inputs) return null;

    return (
        <div className="card">
            <h3>Live Weather & Environmental Data</h3>
            <div className="grid">
                <div className="stat-box">
                    <div className="stat-label">Temperature</div>
                    <div className="stat-value">{inputs.temperature.toFixed(1)}°C</div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Humidity</div>
                    <div className="stat-value">{inputs.humidity.toFixed(1)}%</div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Rainfall (Est)</div>
                    <div className="stat-value">{inputs.rainfall.toFixed(1)} mm</div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
