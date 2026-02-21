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
        <div className="input-group">
            <input
                type="text"
                placeholder="Search for a city..."
                value={query}
                onChange={(e) => {
                    isTyping.current = true;
                    setQuery(e.target.value);
                }}
            />
            {loading && <div style={{ position: 'absolute', right: '10px', top: '15px' }}>...</div>}

            {suggestions.length > 0 && (
                <div className="dropdown">
                    {suggestions.map((item, idx) => (
                        <div
                            key={idx}
                            className="dropdown-item"
                            onClick={() => handleSelect(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
