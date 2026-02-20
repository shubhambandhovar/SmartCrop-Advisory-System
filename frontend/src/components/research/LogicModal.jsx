import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function LogicModal({ isOpen, onClose, title, plainText, code, math }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{
                background: '#fff',
                width: '80%',
                maxWidth: '900px',
                maxHeight: '85vh',
                borderRadius: '8px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '15px', right: '15px',
                        background: 'transparent', border: 'none',
                        fontSize: '1.5rem', cursor: 'pointer', color: '#666'
                    }}
                >
                    &times;
                </button>

                <h2 style={{ marginTop: 0, borderBottom: '2px solid var(--primary-green)', paddingBottom: '0.5rem', color: '#333' }}>
                    {title} <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'normal' }}>(Developer View)</span>
                </h2>

                <div style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: '#444' }}>
                    <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#2c3e50' }}>Plain English Explanation</h4>
                    <p style={{ margin: 0 }}>{plainText}</p>
                </div>

                {math && (
                    <div style={{ marginBottom: '1.5rem', background: '#f5f7fa', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid #3498db' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2980b9' }}>Mathematical Intuition</h4>
                        <div style={{ fontFamily: 'monospace', fontSize: '1rem', whiteSpace: 'pre-wrap' }}>{math}</div>
                    </div>
                )}

                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Exact Generating Logic</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#e74c3c' }}>
                        * Read-only snippet. Highlights the exact python/js segment used mapped to this module.
                    </p>
                    <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers customStyle={{ borderRadius: '6px', fontSize: '0.9rem', margin: 0 }}>
                        {code}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
}
