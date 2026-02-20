import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function KMeansCountsChart({ data }) {
    if (!data || !data.clusters) return <p>No cluster data available.</p>;

    const chartData = data.clusters.map((clusterName, i) => ({
        name: clusterName,
        count: data.counts[i]
    }));

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h3>K-Means Cluster Counts</h3>
            <p>Distribution of data points across K-Means clusters.</p>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#ff7300" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
