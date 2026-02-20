import React from 'react';

export default function CorrelationHeatmap({ data }) {
    if (!data) return null;

    const { features, values } = data;

    const getColor = (val) => {
        // Basic red for negative, blue for positive
        const intensity = Math.abs(val);
        if (val > 0) return `rgba(0, 0, 255, ${intensity})`;
        if (val < 0) return `rgba(255, 0, 0, ${intensity})`;
        return '#eee';
    };

    return (
        <>
            <h3>Correlation Heatmap</h3>
            <p>Interactive grid showing linear correlation between soil/weather features.</p>
            <div style={{ display: 'flex', overflowX: 'auto', paddingTop: '10px' }}>
                <table style={{ borderCollapse: 'collapse', textAlign: 'center', minWidth: '600px', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px' }}></th>
                            {features.map((f, i) => (
                                <th key={i} style={{ padding: '8px', fontSize: '13px', transform: 'rotate(-45deg)' }}>{f}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {values.map((row, i) => (
                            <tr key={i}>
                                <th style={{ padding: '8px', textAlign: 'right', fontSize: '13px' }}>{features[i]}</th>
                                {row.map((cell, j) => (
                                    <td
                                        key={j}
                                        title={`${features[i]} vs ${features[j]}: ${cell.toFixed(2)}`}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            padding: '8px',
                                            backgroundColor: getColor(cell),
                                            color: Math.abs(cell) > 0.5 ? '#fff' : '#000',
                                            border: '1px solid #ccc',
                                            cursor: 'crosshair',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {cell.toFixed(2)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
