import React from 'react';
import { Beaker, Activity, FlaskConical, Droplet } from 'lucide-react';

const SoilCard = ({ inputs }) => {
    if (!inputs) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FlaskConical className="text-orange-500" size={24} />
                Soil telemetry
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex flex-col items-center justify-center text-center hover:bg-orange-50 transition-colors">
                    <Activity className="text-orange-400 mb-2" size={20} />
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Nitrogen (N)</div>
                    <div className="text-xl font-bold text-gray-800">{inputs.N}</div>
                </div>
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 flex flex-col items-center justify-center text-center hover:bg-amber-50 transition-colors">
                    <Activity className="text-amber-400 mb-2" size={20} />
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Phosphorus (P)</div>
                    <div className="text-xl font-bold text-gray-800">{inputs.P}</div>
                </div>
                <div className="bg-yellow-50/50 rounded-xl p-4 border border-yellow-100 flex flex-col items-center justify-center text-center hover:bg-yellow-50 transition-colors">
                    <Activity className="text-yellow-400 mb-2" size={20} />
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Potassium (K)</div>
                    <div className="text-xl font-bold text-gray-800">{inputs.K}</div>
                </div>
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex flex-col items-center justify-center text-center hover:bg-emerald-50 transition-colors">
                    <Droplet className="text-emerald-400 mb-2" size={20} />
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">pH Level</div>
                    <div className="text-xl font-bold text-gray-800">{inputs.ph}</div>
                </div>
            </div>
        </div>
    );
};

export default SoilCard;
