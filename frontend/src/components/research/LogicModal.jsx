import React, { useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X, BookOpen, Sigma, Code } from 'lucide-react';

export default function LogicModal({ isOpen, onClose, title, plainText, code, math }) {
    // Basic esc key handler
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-11/12 max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 leading-tight m-0">{title}</h2>
                            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mt-0.5">Developer Logic View</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                    {/* Explanation Section */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                        <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                            Plain English Intuition
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm">
                            {plainText}
                        </p>
                    </div>

                    {/* Math Section */}
                    {math && (
                        <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-5">
                            <h4 className="text-sm font-bold text-purple-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Sigma size={16} /> Mathematical Core
                            </h4>
                            <div className="bg-white border border-purple-100 p-4 rounded-lg font-mono text-purple-900 text-sm overflow-x-auto">
                                {math}
                            </div>
                        </div>
                    )}

                    {/* Code Section */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-end justify-between mb-2 px-1">
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                <Code size={16} /> Generated Logic
                            </h4>
                            <p className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                Read-Only Reference
                            </p>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-1">
                            <SyntaxHighlighter
                                language="python"
                                style={vscDarkPlus}
                                showLineNumbers={true}
                                customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.85rem', height: '100%', borderRadius: 0, background: '#1e1e1e' }}
                            >
                                {code}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside to close overlay */}
            <div className="absolute inset-0 z-[-1]" onClick={onClose} />
        </div>
    );
}
