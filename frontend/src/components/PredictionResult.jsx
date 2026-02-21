import React, { useEffect, useState } from 'react';
import { Sprout, BarChart, Info, Droplets, Leaf } from 'lucide-react';

const PredictionResult = ({ result }) => {
    // For CSS animation trigger
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!result) return null;

    // SHAP explainability
    const shap = result.explainability?.feature_impact || [];
    // Crop calendar
    const cropCalendar = result.crop_calendar;
    // Pest/disease alert
    const pestAlert = result.pest_disease_alert;
    // Soil health analytics
    const soilAnalysis = result.soil_analysis;
    // Top clusters
    const topClusters = result.top_clusters;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <Sprout size={24} />
                    </div>
                    <h2 className="text-2xl font-bold border-b-2 border-green-500 pb-1 w-max text-gray-800">Recommended Crops</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {result.recommendations?.map((rec, idx) => {
                        const scoreNum = parseFloat(rec.confidence);
                        return (
                            <div key={idx} className={`relative flex flex-col rounded-xl border p-5 transition-all duration-300 ${idx === 0
                                    ? 'border-green-400 bg-green-50/50 shadow-md ring-1 ring-green-100 scale-[1.02]'
                                    : 'border-gray-100 bg-white hover:border-green-200 hover:shadow-sm'
                                }`}>
                                {idx === 0 && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        Top Match
                                    </span>
                                )}
                                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Rank {idx + 1}</div>
                                <div className="text-2xl font-bold text-gray-800 mb-1">{rec.crop_localized || rec.crop}</div>

                                {rec.crop_localized && rec.crop_localized !== rec.crop && (
                                    <div className="text-xs text-gray-500 italic mb-3">{rec.crop}</div>
                                )}

                                <div className="mt-auto">
                                    <div className="flex justify-between text-sm font-medium mb-1.5">
                                        <span className="text-gray-600">Confidence</span>
                                        <span className={idx === 0 ? "text-green-600 font-bold" : "text-gray-700"}>{rec.confidence}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${idx === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-green-400'}`}
                                            style={{ width: mounted ? rec.confidence : '0%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6 text-sm italic text-gray-400 text-right flex items-center justify-end gap-1.5">
                    <Info size={14} /> Model: {result.model_type}
                </div>
            </div>

            {/* Top Clusters */}
            {topClusters && (
                <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-blue-500 border-t border-r border-b border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart className="text-blue-500" size={20} />
                        <h3 className="text-lg font-bold text-gray-800">Top 3 Matching Clusters</h3>
                    </div>
                    <div className="space-y-3">
                        {topClusters.map((cluster, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gray-100">
                                <div>
                                    <strong className="text-gray-700 mr-2">Cluster {cluster.cluster_index}</strong>
                                    <span className="text-sm text-gray-500">Dominant: <span className="text-gray-700 font-medium">{cluster.dominant_crops.join(', ')}</span></span>
                                </div>
                                <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-sm shrink-0 shadow-sm border border-blue-100">
                                    Score: {(cluster.score * 100).toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* General Feature Sections (Using original layout style for now, but tailedized) */}

            {/* Standard Scaler Transformation Table */}
            {result.inputs && result.inputs_scaled && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">⚖️ Standard Scaler Validation</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        Before passing your farm data to our models, we standardize the numbers (mean=0, std=1) so features like Rainfall don't overshadow pH.
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Feature</th>
                                    <th className="px-4 py-3 font-semibold">Raw Value</th>
                                    <th className="px-4 py-3 font-semibold">Scaled Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 pt-1">
                                {['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'].map((feat, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-2.5 font-medium text-gray-800 uppercase">{feat}</td>
                                        <td className="px-4 py-2.5 text-gray-600">{result.inputs[feat]?.toFixed(2) || result.inputs[feat]}</td>
                                        <td className="px-4 py-2.5 text-green-600 font-medium bg-green-50/30">{result.inputs_scaled[feat]?.toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SHAP Explainability Note: format changed in previous step */}
            {shap && shap.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-green-500 border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">🔎 Why these crops?</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                        {shap.slice(0, 3).map((item, idx) => (
                            <li key={idx}><span className="font-semibold">{item[0]}:</span> impact score {(item[1]).toFixed(3)}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Crop Calendar & Pest/Disease Alert */}
            {(cropCalendar || pestAlert) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">📅 Crop Calendar & Alerts</h3>
                    <div className="flex flex-wrap gap-8">
                        {cropCalendar && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Leaf className="text-green-500" size={16} />
                                    <span className="font-medium text-gray-700">Planting:</span>
                                    <span className="text-gray-600">{cropCalendar.planting?.join(', ') || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="text-yellow-500">🌾</div>
                                    <span className="font-medium text-gray-700">Harvest:</span>
                                    <span className="text-gray-600">{cropCalendar.harvest?.join(', ') || '-'}</span>
                                </div>
                            </div>
                        )}
                        {pestAlert && (
                            <div className={`text-sm px-4 py-3 rounded-xl border flex items-start gap-2 max-w-sm ${pestAlert.includes('No major') ? 'bg-green-50 border-green-100 text-green-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                                <div className="mt-0.5">🐛</div>
                                <div>
                                    <div className="font-bold mb-0.5">Pest/Disease Alert:</div>
                                    <div>{pestAlert}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Soil Health Analytics */}
            {soilAnalysis && (
                <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-orange-400 border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">🧪 Soil Health Analysis</h3>
                    <div className="flex flex-wrap items-center gap-6 mb-4">
                        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg font-bold border border-orange-100 shadow-sm">
                            Score: {soilAnalysis.soil_score} / 100
                        </div>
                        <div className={`font-bold text-lg ${soilAnalysis.soil_quality?.toLowerCase() === 'good' ? 'text-green-600' :
                                soilAnalysis.soil_quality?.toLowerCase() === 'moderate' ? 'text-orange-500' : 'text-red-500'
                            }`}>
                            Quality: {soilAnalysis.soil_quality}
                        </div>
                    </div>
                    {soilAnalysis.soil_recommendations && soilAnalysis.soil_recommendations.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <strong className="block text-gray-800 mb-2">Recommendations:</strong>
                            <ul className="list-inside list-disc text-sm text-gray-600 space-y-1">
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
