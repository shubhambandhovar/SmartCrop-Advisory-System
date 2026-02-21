import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const LocationSearch = ({ onLocationSelect }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const isTyping = useRef(true);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 2 && isTyping.current) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/search/${query}`);
            setSuggestions(res.data);
        } catch (error) {
            console.error("Search error", error);
        }
        setLoading(false);
    };

    const handleSelect = (item) => {
        isTyping.current = false;
        setQuery(item.name);
        setSuggestions([]);
        onLocationSelect(item);
    };

    return (
        <div className="relative w-full max-w-xl mx-auto flex flex-col gap-1">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-primary-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Enter Village / City"
                    className="w-full pl-12 pr-10 py-4 border-2 border-gray-200 rounded-xl outline-none focus:border-primary-green focus:ring-4 focus:ring-green-50 shadow-sm text-gray-700 font-medium text-lg transition-all duration-200"
                    value={query}
                    onChange={(e) => {
                        isTyping.current = true;
                        setQuery(e.target.value);
                    }}
                />
                {loading && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <div className="w-5 h-5 border-2 border-primary-green border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-500 pl-2">Start typing to see suggested locations...</p>

            {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 divide-y divide-gray-50">
                    {suggestions.map((item, idx) => (
                        <div
                            key={idx}
                            className="px-5 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-150 flex items-center gap-3 text-gray-700"
                            onClick={() => handleSelect(item)}
                        >
                            <span className="shrink-0 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                            <span className="font-medium text-sm truncate">{item.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
