import React, { useState } from 'react';
import api from '../../services/api';

export default function SimulationPanel({ onSimulate, onReset, isSimulating }) {
    const [params, setParams] = useState({
        model_type: 'Random Forest',
        n_estimators: 100,
        max_depth: '',
        learning_rate: 0.1,
        n_clusters: 22,
        use_smote: false,
        scaling_method: 'Standard'
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
                ...params,
                max_depth: params.max_depth === '' ? null : Number(params.max_depth)
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
        <div style={{
            background: '#fff3e0',
            border: '2px dashed #ff9800',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            width: '100%',
            maxWidth: '1000px',
            boxSizing: 'border-box'
        }}>
            <h3 style={{ color: '#e65100', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="lucide-flask-conical">🧪</span> Developer Simulation Mode
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                Temporarily rebuild models in-memory to test how parameter changes affect evaluation metrics.
                <strong> No production artifacts are overwritten.</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Model Type</label>
                    <select name="model_type" value={params.model_type} onChange={handleChange} style={inputStyle}>
                        <option>Random Forest</option>
                        <option>AdaBoost</option>
                        <option>Gradient Boosting</option>
                        <option>Decision Tree</option>
                        <option>Logistic Regression</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>n_estimators (Trees)</label>
                    <input type="number" name="n_estimators" value={params.n_estimators} onChange={handleChange} style={inputStyle} min="10" max="500" />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Max Depth</label>
                    <input type="number" name="max_depth" value={params.max_depth} onChange={handleChange} style={inputStyle} placeholder="None (Auto)" min="1" max="50" />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Learning Rate</label>
                    <input type="number" name="learning_rate" value={params.learning_rate} onChange={handleChange} style={inputStyle} step="0.01" min="0.01" max="1" />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>KMeans Clusters</label>
                    <input type="number" name="n_clusters" value={params.n_clusters} onChange={handleChange} style={inputStyle} min="2" max="50" />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Scaling Method</label>
                    <select name="scaling_method" value={params.scaling_method} onChange={handleChange} style={inputStyle}>
                        <option>Standard</option>
                        <option>MinMax</option>
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '1.2rem' }}>
                    <input type="checkbox" name="use_smote" checked={params.use_smote} onChange={handleChange} style={{ width: 'auto' }} />
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setParams(p => ({ ...p, use_smote: !p.use_smote }))}>Apply SMOTE</label>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={handleRunSimulation}
                    disabled={loading}
                    style={{ background: '#ff9800', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Running Simulation...' : '▶ Run Simulation'}
                </button>

                {isSimulating && (
                    <button
                        onClick={onReset}
                        style={{ background: '#e0e0e0', color: '#333', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        🔄 Reset to Production
                    </button>
                )}
            </div>

            {isSimulating && !loading && (
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    ⚠ Simulation Mode Active (Temporary). Changes will disappear on refresh.
                </div>
            )}
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
};
