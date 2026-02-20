import React, { useMemo } from 'react';

export default function ConfusionMatrix({ data }) {
    if (!data) return null;

    const { classes, matrix } = data;

    const maxVal = useMemo(() => {
        let max = 0;
        matrix.forEach(row => {
            row.forEach(val => {
                if (val > max) max = val;
            });
        });
        return max;
    }, [matrix]);

    const getColor = (val) => {
        // Darker green for higher numbers
        const intensity = maxVal > 0 ? (val / maxVal) : 0;
        if (val === 0) return '#f9f9f9';
        return `rgba(46, 125, 50, ${intensity + 0.1})`; // var(--primary-green) tinted
    };

    return (
        <>
            <h3>Confusion Matrix (Random Forest)</h3>
            <p>True label vs Predicted label counts across the test set. Diagonal holds correct predictions.</p>
            <div style={{ padding: '1rem', overflowX: 'auto', background: '#fff', border: '1px solid #ddd' }}>
                <table style={{ borderCollapse: 'collapse', textAlign: 'center', minWidth: '800px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '4px', fontSize: '12px' }}>Actual \ Predicted</th>
                            {classes.map((cls, i) => (
                                <th key={`h-${i}`} style={{ padding: '4px', fontSize: '10px', transform: 'rotate(-45deg)' }}>{cls}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={`r-${i}`}>
                                <th style={{ padding: '4px', fontSize: '10px', textAlign: 'right', minWidth: '80px' }}>{classes[i]}</th>
                                {row.map((cell, j) => (
                                    <td
                                        key={`c-${i}-${j}`}
                                        title={`Actual: ${classes[i]} | Predicted: ${classes[j]} | Count: ${cell}`}
                                        style={{
                                            padding: '4px',
                                            backgroundColor: getColor(cell),
                                            color: cell > (maxVal / 2) ? '#fff' : '#000',
                                            border: '1px solid #efefef',
                                            cursor: 'crosshair',
                                            fontSize: '10px'
                                        }}
                                    >
                                        {cell > 0 ? cell : ''}
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
