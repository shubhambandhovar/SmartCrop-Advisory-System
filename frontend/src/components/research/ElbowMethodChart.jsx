import React from 'react';

export default function ElbowMethodChart() {
    const imageUrl = `http://127.0.0.1:5000/api/dev/plots/kmeans_elbow.png`;

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h3>K-Means Elbow Method</h3>
            <p>Determining the optimal number of clusters by minimizing inertia.</p>
            <div style={{
                marginTop: '1.5rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '1rem',
                background: '#fafafa',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <img
                    src={imageUrl}
                    alt="K-Means Elbow Plot"
                    title="Inertia vs k"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        maxHeight: '400px',
                        objectFit: 'contain',
                        borderRadius: '4px'
                    }}
                />
                <div style={{ display: 'none', color: '#888', padding: '2rem' }}>
                    Warning: Elbow method plot could not be loaded from backend. Run training pipeline to generate.
                </div>
            </div>
        </div>
    );
}
