import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ClusterVisualization({ data }) {
    if (!data) return null;

    // Separate normal points from centroids
    const normalPoints = data.points.filter(p => !p.is_centroid);
    const centroids = data.points.filter(p => p.is_centroid);

    // Generates some distinct colors for clusters
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#ffc0cb"];

    return (
        <>
            <h3>K-Means PCA Scatter Plot</h3>
            <p>2D projection of crop-environment samples representing underlying agnostic agricultural regions.</p>
            <div style={{ height: 400, width: '100%' }}>
                <ResponsiveContainer minWidth={0}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="x" name="PCA 1" />
                        <YAxis type="number" dataKey="y" name="PCA 2" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                            if (payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div style={{ background: '#fff', border: '1px solid #ccc', padding: '10px', fontSize: '12px' }}>
                                        <p><strong>{data.is_centroid ? `Centroid ${data.cluster}` : `Cluster: ${data.cluster}`}</strong></p>
                                        {data.label && <p>Label: {data.label}</p>}
                                        <p>PCA1: {data.x}</p>
                                        <p>PCA2: {data.y}</p>
                                    </div>
                                );
                            }
                            return null;
                        }} />
                        <Scatter name="Data Points" data={normalPoints} fill="#8884d8">
                            {normalPoints.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[entry.cluster % colors.length]} />
                            ))}
                        </Scatter>
                        {/* Overlay centroids via second scatter with huge shapes, black cross ideally, using star or cross symbol in future. Using big red dot for now. */}
                        <Scatter name="Centroids" data={centroids} fill="red" shape="star" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
