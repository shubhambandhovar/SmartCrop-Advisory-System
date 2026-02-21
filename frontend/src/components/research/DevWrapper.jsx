import React, { useState } from 'react';
import { Code2, Info } from 'lucide-react';
import LogicModal from './LogicModal';

export default function DevWrapper({ children, devMode, title, plainText, code, math, path }) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 m-0 leading-tight">
                        {title}
                        <div className="group relative flex items-center">
                            <Info size={16} className="text-gray-400 cursor-help" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-gray-800 text-white text-xs rounded py-2 px-3 z-20 shadow-lg">
                                {plainText}
                            </div>
                        </div>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {plainText}
                    </p>
                </div>

                {devMode && (
                    <button
                        title="Developer: View Engine Logic"
                        onClick={() => setModalOpen(true)}
                        className="shrink-0 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors duration-200"
                    >
                        <Code2 size={14} /> View Logic
                    </button>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col items-center justify-start min-h-0 w-full relative overflow-auto">
                <div className="w-full flex flex-col items-center">
                    {children}
                </div>
            </div>

            {modalOpen && (
                <LogicModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={title}
                    plainText={plainText}
                    code={code}
                    math={math}
                    path={path}
                />
            )}
        </div>
    );
}
