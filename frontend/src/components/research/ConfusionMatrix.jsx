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
        if (val === 0) return 'bg-gray-50 text-gray-400';
        const intensity = maxVal > 0 ? (val / maxVal) : 0;
        if (intensity > 0.6) return 'bg-green-700 text-white font-bold';
        if (intensity > 0.3) return 'bg-green-500 text-white font-bold';
        if (intensity > 0) return 'bg-green-200 text-green-900 font-bold';
        return 'bg-green-50 text-green-800';
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Confusion Matrix (Random Forest)</h3>
            <p className="text-xs text-gray-500 mb-6 text-center">True label vs Predicted label counts. Diagonal blocks represent accurate classifications.</p>

            <div className="w-full overflow-auto border border-gray-200 rounded-xl shadow-sm bg-white p-4">
                <table className="w-auto border-collapse text-center mx-auto whitespace-nowrap">
                    <thead>
                        <tr>
                            <th className="p-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-200 align-bottom pb-4 text-right pr-4">
                                Actual \ Predicted
                            </th>
                            {classes.map((cls, i) => (
                                <th key={`h-${i}`} className="p-2 align-bottom border-b border-gray-200 h-[100px]">
                                    <div className="flex items-center justify-center w-6 overflow-visible">
                                        <span className="-rotate-45 origin-bottom-left translate-y-3 -translate-x-2 text-[10px] lowercase text-gray-600 font-bold whitespace-nowrap">
                                            {cls}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={`r-${i}`} className="group">
                                <th className="p-2 text-[10px] text-right font-bold text-gray-600 lowercase border-r border-gray-200 px-4 group-hover:bg-gray-50 transition-colors">
                                    {classes[i]}
                                </th>
                                {row.map((cell, j) => (
                                    <td
                                        key={`c-${i}-${j}`}
                                        title={`Actual: ${classes[i]} | Predicted: ${classes[j]} | Count: ${cell}`}
                                        className={`w-8 h-8 p-1 text-[10px] border border-gray-100 transition-colors cursor-crosshair hover:bg-green-300 hover:text-green-900 ${getColor(cell)}`}
                                    >
                                        {cell > 0 ? cell : ''}
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
