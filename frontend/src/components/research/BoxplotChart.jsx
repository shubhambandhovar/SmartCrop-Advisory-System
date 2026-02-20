import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BoxplotChart({ data }) {
    if (!data || data.length === 0) return <p>No Boxplot data available.</p>;

    const chartData = data.map(d => ({
        name: d.feature,
        IQR: [d.q1, d.q3],
        Min: d.min,
        Median: d.median,
        Max: d.max
    }));

    // Custom Tooltip to make it look like a real Boxplot summary
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataEntry = payload[0].payload;
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{label}</p>
                    <p style={{ margin: 0, color: '#ff7300' }}>Max: {dataEntry.Max.toFixed(2)}</p>
                    <p style={{ margin: 0, color: '#8884d8' }}>Q3: {dataEntry.IQR[1].toFixed(2)}</p>
                    <p style={{ margin: 0, color: '#000', fontWeight: 'bold' }}>Median: {dataEntry.Median.toFixed(2)}</p>
                    <p style={{ margin: 0, color: '#8884d8' }}>Q1: {dataEntry.IQR[0].toFixed(2)}</p>
                    <p style={{ margin: 0, color: '#82ca9d' }}>Min: {dataEntry.Min.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h3>Feature Distribution Span</h3>
            <p>Boxplots showing IQR (25th to 75th percentile), Min, Max, and Median.</p>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="IQR" fill="#8884d8" name="Interquartile Range (Q1 - Q3)" barSize={40} />
                        <Line type="monotone" dataKey="Max" stroke="#ff7300" strokeWidth={2} dot={{ r: 3 }} name="Maximum Core Value" />
                        <Line type="monotone" dataKey="Median" stroke="#000" strokeWidth={3} dot={{ r: 4 }} name="Median" />
                        <Line type="monotone" dataKey="Min" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} name="Minimum Core Value" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
