import React from 'react';

export default function ScalerVisualization({ data }) {
    if (!data || !data.features || data.features.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>⚠️ No Scaler parameters loaded. Ensure the backend is providing scaler-params.</p>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'left', width: '100%', overflowX: 'auto' }}>
            <h3>⚖️ Standard Scaler Validation</h3>
            <p>
                To ensure features with large scales (like Rainfall) don't dominate clustering distances over small features (like pH),
                we apply a <code>StandardScaler</code>. This standardizes all numeric values to have a Mean of 0 and a Standard Deviation of 1.
            </p>
            <div style={{
                marginTop: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'auto',
                maxWidth: '100%'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '0.8rem', backgroundColor: '#f1f8f5', borderBottom: '2px solid #ddd' }}>Feature</th>
                            <th style={{ padding: '0.8rem', backgroundColor: '#f1f8f5', borderBottom: '2px solid #ddd' }}>Training Mean (μ)</th>
                            <th style={{ padding: '0.8rem', backgroundColor: '#f1f8f5', borderBottom: '2px solid #ddd' }}>Training Std Dev (σ)</th>
                            <th style={{ padding: '0.8rem', backgroundColor: '#f1f8f5', borderBottom: '2px solid #ddd' }}>Scaled Formula</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.features.map((feat, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '0.8rem', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                                    {feat.toUpperCase()}
                                </td>
                                <td style={{ padding: '0.8rem', borderBottom: '1px solid #eee' }}>
                                    {data.means[idx].toFixed(2)}
                                </td>
                                <td style={{ padding: '0.8rem', borderBottom: '1px solid #eee' }}>
                                    {data.scales[idx].toFixed(2)}
                                </td>
                                <td style={{ padding: '0.8rem', borderBottom: '1px solid #eee', fontFamily: 'monospace', color: '#666' }}>
                                    z = (x - {data.means[idx].toFixed(2)}) / {data.scales[idx].toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
