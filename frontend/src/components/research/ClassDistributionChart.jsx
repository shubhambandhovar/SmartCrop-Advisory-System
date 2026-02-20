import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ClassDistributionChart({ data }) {
    if (!data) return null;

    const chartData = data.labels.map((label, index) => ({
        name: label,
        count: data.counts[index]
    }));

    return (
        <>
            <h3>Class Distribution (Data Imbalance)</h3>
            <p>Visualizing the initial distribution of crops before SMOTE balancing.</p>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3f51b5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
