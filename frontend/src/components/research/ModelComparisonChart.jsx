import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ModelComparisonChart({ data }) {
    if (!data) return null;

    const chartData = data.labels.map((label, index) => ({
        name: label,
        accuracy: data.accuracy[index] * 100 // Convert to percentage
    }));

    return (
        <>
            <h3>Model Comparison</h3>
            <p>Accuracy scores of different experimented models.</p>
            <div style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(val) => `${val.toFixed(2)}%`} />
                        <Bar dataKey="accuracy">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name.includes("Random Forest") ? "#2e7d32" : "#8884d8"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
