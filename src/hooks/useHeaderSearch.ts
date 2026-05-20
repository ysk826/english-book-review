import { useState, useCallback } from 'react';
import axios from 'axios';
import { SearchResultBook } from '@/types/book';

export const useHeaderSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResultBook[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/books?q=${encodeURIComponent(searchQuery.trim())}`);
            setResults(data.items || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        setResults([]);
        setQuery('');
    }, []);

    return { query, setQuery, results, loading, handleSearch, clearResults };
};
