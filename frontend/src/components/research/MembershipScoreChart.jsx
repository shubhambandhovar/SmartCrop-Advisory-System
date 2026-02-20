import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function MembershipScoreChart({ data }) {
    if (!data) return null;

    // Filter out tiny scores so pie chart isn't cramped with 20 tiny slices
    const mergedData = data.clusters.map((c, i) => ({
        name: c,
        value: data.scores[i]
    })).sort((a, b) => b.value - a.value);

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
        </>
    );
}
