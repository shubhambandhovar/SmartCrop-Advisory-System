import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GBChart({ data }) {
    if (!data || !data.features) return <p>No Gradient Boosting data available.</p>;

    const chartData = data.features.map((feature, i) => ({
        feature,
        importance: data.importances[i]
    })).sort((a, b) => b.importance - a.importance);

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h3>Gradient Boosting Feature Importance</h3>
            <p>Feature contribution weights in Gradient Boosting classifier.</p>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="feature" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="importance" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
