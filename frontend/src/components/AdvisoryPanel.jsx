
import React from 'react';

const PANEL_LABELS = {
    en: {
        title: 'Agricultural Advisory',
        fertilizer: 'Fertilizer',
        irrigation: 'Irrigation',
        bestSeason: 'Best Season',
        soilNote: 'Soil Note'
    },
    hi: {
        title: 'कृषि सलाह',
        fertilizer: 'उर्वरक',
        irrigation: 'सिंचाई',
        bestSeason: 'उपयुक्त मौसम',
        soilNote: 'मिट्टी नोट'
    },
    mr: {
        title: 'कृषी सल्ला',
        fertilizer: 'खत',
        irrigation: 'सिंचन',
        bestSeason: 'योग्य हंगाम',
        soilNote: 'माती नोंद'
    },
    es: {
        title: 'Asesoramiento Agrícola',
        fertilizer: 'Fertilizante',
        irrigation: 'Riego',
        bestSeason: 'Mejor Temporada',
        soilNote: 'Nota del Suelo'
    },
    fr: {
        title: 'Conseil Agricole',
        fertilizer: 'Engrais',
        irrigation: 'Irrigation',
        bestSeason: 'Meilleure Saison',
        soilNote: 'Note du Sol'
    }
};

const AdvisoryPanel = ({ advisory, lang = 'en' }) => {
    if (!advisory) return null;
    const labels = PANEL_LABELS[lang] || PANEL_LABELS.en;

    return (
        <div className="card advisory-panel">
            <h2>{labels.title}</h2>
            <div className="grid">
                <div className="advisory-item">
                    <h4>🧪 {labels.fertilizer}</h4>
                    <p>{advisory.fertilizer_tip}</p>
                </div>
                <div className="advisory-item">
                    <h4>💧 {labels.irrigation}</h4>
                    <p>{advisory.irrigation_tip}</p>
                </div>
                <div className="advisory-item">
                    <h4>📅 {labels.bestSeason}</h4>
                    <p>{advisory.best_season}</p>
                </div>
                <div className="advisory-item">
                    <h4>🌱 {labels.soilNote}</h4>
                    <p>{advisory.soil_note}</p>
                </div>
            </div>
        </div>
    );
};

export default AdvisoryPanel;
