import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ShapSummary({ data }) {
    if (!data) return null;

    const chartData = data.features.map((feature, index) => ({
        name: feature,
        impact: data.impact[index]
    })).sort((a, b) => a.impact - b.impact); // Sort ascending for vertical bar layout

    return (
        <>
            <h3>SHAP Feature Global Impact</h3>
            <p>Average absolute impact of each feature on model output magnitude.</p>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="impact" name="Mean |SHAP Value|" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="impact" fill="#ff4081" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
