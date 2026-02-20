import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import LogicModal from './LogicModal';

export default function DevWrapper({ children, devMode, title, plainText, code, math }) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {devMode && (
                <button
                    title="Developer: View Engine Logic"
                    onClick={() => setModalOpen(true)}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '0',
                        background: '#e3f2fd',
                        color: '#1565c0',
                        border: '1px solid #90caf9',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <Eye size={14} /> View Logic
                </button>
            )}

            {children}

            {modalOpen && (
                <LogicModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={title}
                    plainText={plainText}
                    code={code}
                    math={math}
                />
            )}
        </div>
    );
}
