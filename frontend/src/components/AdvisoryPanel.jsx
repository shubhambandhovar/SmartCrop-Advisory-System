
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
        <div className="bg-green-50 rounded-2xl border-l-8 border-l-primary-green p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">🚜</span> {labels.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
                <div className="bg-white/80 rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">🧪 {labels.fertilizer}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{advisory.fertilizer_tip}</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">💧 {labels.irrigation}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{advisory.irrigation_tip}</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-yellow-700 mb-2 flex items-center gap-2">📅 {labels.bestSeason}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{advisory.best_season}</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-orange-700 mb-2 flex items-center gap-2">🌱 {labels.soilNote}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{advisory.soil_note}</p>
                </div>
            </div>
        </div>
    );
};

export default AdvisoryPanel;
