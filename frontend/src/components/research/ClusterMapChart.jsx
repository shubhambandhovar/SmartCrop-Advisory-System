import React from 'react';

export default function ClusterMapChart({ data }) {
    if (!data || !data.classes || !data.clusters) return <p>No Cluster Map data available.</p>;

    const maxVal = Math.max(...data.matrix.flat());

    const getColor = (value) => {
        if (value === 0) return 'rgba(255, 255, 255, 0.5)';
        const alpha = Math.min(value / (maxVal || 1), 1);
        return `rgba(76, 175, 80, ${alpha})`;
    };

    return (
        <div style={{ textAlign: 'center', width: '100%', overflowX: 'auto' }}>
            <h3>Cluster Affinity Heatmap</h3>
            <p>Interactive grid mapping underlying clusters to crop labels.</p>
            <div style={{
                marginTop: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'auto',
                maxWidth: '100%'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '0.8rem', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Cluster</th>
                            {data.classes.map(c => (
                                <th key={`header-${c}`} style={{ padding: '0.8rem', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', transform: 'rotate(-45deg)', whiteSpace: 'nowrap', height: '80px' }}>
                                    {c}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.matrix.map((row, i) => (
                            <tr key={`row-${i}`}>
                                <td style={{ padding: '0.8rem', fontWeight: 'bold', backgroundColor: '#f9f9f9', borderRight: '2px solid #ddd', borderBottom: '1px solid #eee' }}>
                                    {data.clusters[i]}
                                </td>
                                {row.map((val, j) => (
                                    <td key={`cell-${i}-${j}`} style={{
                                        padding: '0.8rem',
                                        backgroundColor: getColor(val),
                                        borderBottom: '1px solid #eee',
                                        borderRight: '1px solid #eee',
                                        color: val > maxVal * 0.5 ? 'white' : 'black',
                                        fontWeight: val > 0 ? 'bold' : 'normal'
                                    }}>
                                        {val > 0 ? val.toFixed(2) : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
