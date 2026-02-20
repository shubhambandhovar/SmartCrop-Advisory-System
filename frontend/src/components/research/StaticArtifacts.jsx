import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const artifactTexts = [
    { name: "Model Comparison Report", file: "model_comparison.txt" },
    { name: "Stratified K-Fold CV Results", file: "cross_validation_results.txt" },
    { name: "Random Forest Metrics", file: "rf_metrics.txt" },
    { name: "Boosting Comparison Report", file: "boosting_comparison_report.md" }
];

export default function StaticArtifacts() {
    const [textContents, setTextContents] = useState({});

    useEffect(() => {
        const fetchTexts = async () => {
            const results = {};
            for (const item of artifactTexts) {
                try {
                    const res = await api.get(`/dev/results/${item.file}`);
                    results[item.file] = res.data.content;
                } catch (err) {
                    console.error("Error fetching", item.file, err);
                    results[item.file] = "Failed to load document.";
                }
            }
            setTextContents(results);
        };
        fetchTexts();
    }, []);

    return (
        <div style={{ marginTop: '3rem', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary-green)' }}>Raw Evaluation Logs</h2>
                <p>Textual logs from the backend engine detailing exact precision/recall across runs.</p>
                <hr style={{ maxWidth: '400px', margin: '1rem auto', borderColor: '#eee' }} />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '2rem',
                wordBreak: 'break-word',
                overflow: 'hidden'
            }}>
                {artifactTexts.map((txt, idx) => (
                    <div key={idx} className="chart-card" style={{ textAlign: 'left', overflow: 'hidden' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#555' }}>{txt.name} ({txt.file})</h4>
                        <pre style={{
                            background: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '4px',
                            overflowX: 'auto',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            border: '1px solid #e0e0e0',
                            fontSize: '0.85rem',
                            lineHeight: '1.4'
                        }}>
                            {textContents[txt.file] || "Loading..."}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
}
