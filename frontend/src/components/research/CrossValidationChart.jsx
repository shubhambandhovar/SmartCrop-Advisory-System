import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CrossValidationChart({ data }) {
    if (!data) return null;

    const chartData = data.folds.map((fold, index) => ({
        name: fold,
        accuracy: data.accuracies[index] * 100
    }));

    return (
        <>
            <h3>Stratified K-Fold CV Stability</h3>
            <p>Mean: {(data.mean * 100).toFixed(2)}% ± {(data.std * 100).toFixed(2)}%</p>
            <div style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(val) => `${val.toFixed(2)}%`} />
                        <Line type="monotone" dataKey="accuracy" stroke="#ff7300" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
