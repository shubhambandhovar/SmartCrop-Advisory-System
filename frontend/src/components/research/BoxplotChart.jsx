import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BoxplotChart({ data }) {
    if (!data || data.length === 0) return <p>No Boxplot data available.</p>;

    // We use a Composed chart to represent the spread (min/max) and the center (median)
    const chartData = data.map(d => ({
        name: d.feature,
        Min: d.min,
        Median: d.median,
        Max: d.max
    }));

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h3>Feature Distribution Span</h3>
            <p>Min, Median, and Max values for each agriculture feature.</p>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Median" barSize={40} fill="#413ea0" />
                        <Line type="monotone" dataKey="Max" stroke="#ff7300" />
                        <Line type="monotone" dataKey="Min" stroke="#82ca9d" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
