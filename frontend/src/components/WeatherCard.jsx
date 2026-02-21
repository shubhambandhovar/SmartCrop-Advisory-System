import React from 'react';
import { Cloud, Thermometer, Droplets, CloudRain } from 'lucide-react';

const WeatherCard = ({ inputs }) => {
    if (!inputs) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Cloud className="text-blue-500" size={24} />
                Live Weather
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors">
                    <Thermometer className="text-blue-400 mb-2" size={24} />
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Temperature</div>
                    <div className="text-2xl font-bold text-gray-800">{inputs.temperature.toFixed(1)}°C</div>
                </div>
                <div className="bg-cyan-50/50 rounded-xl p-4 border border-cyan-100 flex flex-col items-center justify-center text-center hover:bg-cyan-50 transition-colors">
                    <Droplets className="text-cyan-400 mb-2" size={24} />
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Humidity</div>
                    <div className="text-2xl font-bold text-gray-800">{inputs.humidity.toFixed(1)}%</div>
                </div>
                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex flex-col items-center justify-center text-center hover:bg-indigo-50 transition-colors">
                    <CloudRain className="text-indigo-400 mb-2" size={24} />
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Rainfall</div>
                    <div className="text-2xl font-bold text-gray-800">{inputs.rainfall.toFixed(1)}<span className="text-lg text-gray-500 font-medium ml-1">mm</span></div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
