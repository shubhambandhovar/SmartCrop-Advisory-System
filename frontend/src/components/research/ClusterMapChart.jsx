import React from 'react';

export default function ClusterMapChart({ data }) {
    if (!data || !data.classes || !data.clusters) return <p className="text-gray-500 font-medium">No Cluster Map data available.</p>;

    const maxVal = Math.max(...data.matrix.flat());

    const getColor = (value) => {
        if (value === 0) return 'bg-gray-50 text-gray-400';
        const alpha = Math.min(value / (maxVal || 1), 1);
        if (alpha > 0.6) return 'bg-green-600 text-white font-bold';
        if (alpha > 0.3) return 'bg-green-400 text-green-900 font-bold';
        if (alpha > 0) return 'bg-green-200 text-green-800 font-bold';
        return 'bg-green-50 text-gray-500';
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Cluster Affinity Heatmap</h3>
            <p className="text-xs text-gray-500 mb-6 text-center">Interactive grid mapping underlying clusters to crop labels.</p>

            <div className="w-full overflow-auto border border-gray-200 rounded-xl shadow-sm bg-white p-4">
                <table className="w-auto border-collapse text-center mx-auto whitespace-nowrap">
                    <thead>
                        <tr>
                            <th className="p-3 text-xs font-semibold text-gray-500 border-b-2 border-gray-200 align-bottom pb-4 text-right pr-4 bg-white sticky left-0 z-10">
                                Cluster \ Crop
                            </th>
                            {data.classes.map(c => (
                                <th key={`header-${c}`} className="p-2 align-bottom border-b-2 border-gray-200 h-[100px]">
                                    <div className="flex items-center justify-center w-8 overflow-visible">
                                        <span className="-rotate-45 origin-bottom-left translate-y-3 -translate-x-3 text-xs lowercase text-gray-700 font-bold whitespace-nowrap">
                                            {c}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.matrix.map((row, i) => (
                            <tr key={`row-${i}`} className="group hover:bg-gray-50 transition-colors">
                                <td className="p-3 text-sm font-bold text-gray-700 border-r-2 border-gray-200 border-b border-gray-100 sticky left-0 bg-white group-hover:bg-gray-50 z-10 transition-colors text-right px-4">
                                    {data.clusters[i]}
                                </td>
                                {row.map((val, j) => (
                                    <td key={`cell-${i}-${j}`} className={`w-10 h-10 p-2 text-xs border border-gray-100 transition-colors hover:ring-2 hover:ring-green-400 hover:z-20 relative ${getColor(val)}`}>
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
