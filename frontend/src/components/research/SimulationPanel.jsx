import React, { useState } from 'react';
import { FlaskConical, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

export default function SimulationPanel({ onSimulate, onReset, isSimulating }) {
    const [params, setParams] = useState({
        model_type: 'Random Forest',
        n_estimators: 100,
        max_depth: '',
        learning_rate: 0.1,
        n_clusters: 22,
        use_smote: false,
        scaling_method: 'Standard',
        model_weight: 0.7,
        cluster_weight: 0.3
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRunSimulation = async () => {
        setLoading(true);
        try {
            const data = {
                model_type: params.model_type,
                n_estimators: params.n_estimators,
                max_depth: params.max_depth === '' ? null : Number(params.max_depth),
                learning_rate: params.learning_rate,
                n_clusters: params.n_clusters,
                use_smote: params.use_smote,
                scaling_method: params.scaling_method
            };
            const response = await api.post('/simulate/', data);
            onSimulate(response.data);
        } catch (error) {
            console.error("Simulation failed:", error);
            alert("Simulation failed. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-orange-50/50 border-2 border-dashed border-orange-300 rounded-2xl p-6 mb-8 w-full shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <FlaskConical size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-orange-800 m-0">Developer Simulation Panel</h3>
                    <p className="text-xs text-orange-600 font-medium">Temporarily rebuild parameters in memory. Production models are unaffected.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase">Model Type</label>
                    <select name="model_type" value={params.model_type} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all">
                        <option>Random Forest</option>
                        <option>AdaBoost</option>
                        <option>Gradient Boosting</option>
                        <option>Decision Tree</option>
                        <option>Logistic Regression</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase">Tree Count (Estimators)</label>
                    <input type="number" name="n_estimators" value={params.n_estimators} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" min="10" max="500" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase">KMeans Clusters</label>
                    <input type="number" name="n_clusters" value={params.n_clusters} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" min="2" max="50" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase">Scaling Method</label>
                    <select name="scaling_method" value={params.scaling_method} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-orange-200 outline-none transition-all">
                        <option>Standard</option>
                        <option>MinMax</option>
                    </select>
                </div>

                {/* Temporary Parameter Playground (UI ONLY) as requested */}
                <div className="flex flex-col gap-1.5 md:col-span-2 bg-white/60 p-3 rounded-lg border border-orange-100">
                    <label className="text-xs font-bold text-gray-700 uppercase flex justify-between">
                        <span>Ensemble: Model Weight ({params.model_weight})</span>
                        <span className="text-orange-500 font-medium lowercase">ui-only</span>
                    </label>
                    <input type="range" name="model_weight" value={params.model_weight} onChange={handleChange} min="0" max="1" step="0.1" className="w-full accent-orange-500" />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2 bg-white/60 p-3 rounded-lg border border-orange-100">
                    <label className="text-xs font-bold text-gray-700 uppercase flex justify-between">
                        <span>Ensemble: Cluster Weight ({params.cluster_weight})</span>
                        <span className="text-orange-500 font-medium lowercase">ui-only</span>
                    </label>
                    <input type="range" name="cluster_weight" value={params.cluster_weight} onChange={handleChange} min="0" max="1" step="0.1" className="w-full accent-orange-500" />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6">
                <button
                    onClick={handleRunSimulation}
                    disabled={loading}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Play size={18} fill="currentColor" />
                    )}
                    {loading ? 'Running Simulation...' : 'Run Simulation'}
                </button>

                {isSimulating && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                    >
                        <RotateCcw size={18} />
                        Reset to Production
                    </button>
                )}
            </div>

            {isSimulating && !loading && (
                <div className="mt-5 flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-sm font-bold shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <AlertTriangle size={18} className="text-red-500" />
                    Temporary Simulation – Not Saved. Refresh page to clear.
                </div>
            )}
        </div>
    );
};
