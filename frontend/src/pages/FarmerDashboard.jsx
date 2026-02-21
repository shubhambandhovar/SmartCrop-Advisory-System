import React, { useState } from 'react';
import LocationSearch from '../components/LocationSearch';
import WeatherCard from '../components/WeatherCard';
import SoilCard from '../components/SoilCard';
import PredictionResult from '../components/PredictionResult';
import AdvisoryPanel from '../components/AdvisoryPanel';
import Loader from '../components/Loader';
import api from '../services/api';

function FarmerDashboard() {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('en');

    const handlePredict = async () => {
        if (!selectedLocation) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await api.post('/predict', {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                lang: language
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch prediction. Ensure backend is running.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center w-full pb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-3xl text-center relative z-10 transition-shadow hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm">1</span>
                    Select Your Farm Location
                </h3>

                <LocationSearch onLocationSelect={setSelectedLocation} />

                {selectedLocation && (
                    <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium inline-flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Selected: {selectedLocation.name}
                    </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                        <label htmlFor="language-select" className="text-sm font-semibold text-gray-600">
                            Language:
                        </label>
                        <select
                            id="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-gray-800 font-medium outline-none cursor-pointer"
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="mr">Marathi</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={!selectedLocation || loading}
                        className={`px-8 py-3.5 rounded-xl font-bold text-lg text-white shadow-sm transition-all duration-200 w-full sm:w-auto ${!selectedLocation || loading
                                ? 'bg-gray-300 cursor-not-allowed opacity-70'
                                : 'bg-primary-green hover:bg-green-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Analyzing Data...
                            </div>
                        ) : 'Get Recommendation'}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="mt-12 flex flex-col items-center justify-center gap-4 text-green-600 animate-pulse">
                    <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                    <p className="font-medium text-lg text-gray-600">Extracting Soil & Weather telemetry...</p>
                </div>
            )}

            {error && (
                <div className="mt-8 w-full max-w-2xl bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm text-center font-medium animate-in fade-in slide-in-from-bottom-4">
                    {error}
                </div>
            )}

            {result && !loading && (
                <div className="w-full flex flex-col items-center mt-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <WeatherCard inputs={result.inputs} />
                        <SoilCard inputs={result.inputs} />
                    </div>

                    <PredictionResult result={result} />

                    <div className="w-full max-w-4xl mt-6">
                        <AdvisoryPanel advisory={result.advisory} lang={result.language?.applied || language} />
                    </div>

                    {result.language && (
                        <div className="mt-6 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-xs text-gray-500 font-medium tracking-wide">
                            TRANSLATION ENGINE APPLIED: <span className="text-gray-700 uppercase">{result.language.applied}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FarmerDashboard;
