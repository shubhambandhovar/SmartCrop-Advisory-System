import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function MembershipScoreChart({ data, clusterMap }) {
    if (!data) return null;

    // Filter out tiny scores so pie chart isn't cramped with 20 tiny slices
    const mergedData = data.clusters.map((c, i) => ({
        name: c,
        value: data.scores[i]
    })).sort((a, b) => b.value - a.value);

    // Get Top 3 Clusters explicitly
    const top3Clusters = mergedData.slice(0, 3);

    const topData = mergedData.slice(0, 5);
    const others = mergedData.slice(5).reduce((acc, curr) => acc + curr.value, 0);
    if (others > 0.01) {
        topData.push({ name: "Other Clusters", value: others });
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#ccc'];

    return (
        <>
            <h3>Fuzzy Membership Scores</h3>
            <p>Probabilistic cluster membership for a sample test point.</p>
            <div style={{ background: '#eef2f5', padding: '10px', borderRadius: '5px', margin: '15px 0', fontFamily: 'monospace', fontSize: '0.95rem', color: '#2b3a42', textAlign: 'center', border: '1px solid #cdd5df' }}>
                Membership Score &prop; (1 / distance) &times; (proportion_category)
            </div>
            <div style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <PieChart>
                        <Pie
                            data={topData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {topData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {top3Clusters.length > 0 && clusterMap && (
                <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                    <h4 style={{ marginBottom: '0.8rem' }}>Top 3 Clusters</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {top3Clusters.map((cluster, idx) => {
                            let cropsStr = 'N/A';
                            // Extract dominant crops if clusterMap exists
                            if (clusterMap && clusterMap.clusters && clusterMap.matrix && clusterMap.classes) {
                                // `cluster.name` usually looks like "Cluster 3"
                                const clusterIdx = clusterMap.clusters.indexOf(cluster.name);
                                if (clusterIdx !== -1) {
                                    const row = clusterMap.matrix[clusterIdx];
                                    const cropsWithScores = row.map((val, i) => ({ crop: clusterMap.classes[i], val })).sort((a, b) => b.val - a.val);
                                    const topCrops = cropsWithScores.slice(0, 3).filter(c => c.val > 0).map(c => c.crop);
                                    if (topCrops.length > 0) cropsStr = topCrops.join(', ');
                                }
                            }
                            return (
                                <div key={idx} style={{ padding: '0.8rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <strong>{cluster.name}</strong>
                                        <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>
                                            Score: {(cluster.value * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        Dominant Crops: {cropsStr}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
