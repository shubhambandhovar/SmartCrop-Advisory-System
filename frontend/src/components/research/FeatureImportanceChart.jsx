import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FeatureImportanceChart({ data }) {
    if (!data) return null;

    const chartData = data.features.map((feature, index) => ({
        name: feature,
        importance: data.importances[index]
    })).reverse(); // Reverse for display order

    return (
        <>
            <h3>Random Forest Feature Importance</h3>
            <p>Gini impurity reduction across all trees.</p>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="importance" fill="#4caf50" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
