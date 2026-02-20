import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ShapLocalChart({ data }) {
    if (!data || !data.shap_values) return <p>No SHAP Local data available.</p>;

    const chartData = data.features.map((feature, i) => {
        const featVal = data.feature_values[i];
        const numFeatVal = Array.isArray(featVal) ? featVal[0] : featVal;

        const shapVal = data.shap_values[i];
        const numShapVal = Array.isArray(shapVal) ? shapVal[0] : shapVal;

        return {
            feature: `${feature} = ${Number(numFeatVal || 0).toFixed(2)}`,
            value: Number(numShapVal || 0)
        };
    }).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    const baseValue = Array.isArray(data.base_value) ? data.base_value[0] : data.base_value;

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h3>SHAP Local Explainability </h3>
            <p>Feature contributions for predicting '{data.predicted_class}' on a single sample (Base Value: {Number(baseValue || 0).toFixed(3)}).</p>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="feature" type="category" width={110} />
                        <Tooltip formatter={(val) => typeof val === 'number' ? val.toFixed(4) : val} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ff0051' : '#008bfb'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#ff0051' }}>█ Pushes prediction higher</span>
                <span style={{ color: '#008bfb' }}>█ Pushes prediction lower</span>
            </div>
        </div>
    );
}
