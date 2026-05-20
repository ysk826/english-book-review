import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { SearchResultBook } from '@/types/book';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

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
            toast.error('検索に失敗しました');
        } finally {
            setLoading(false);
        }
    }, []);

    // 入力から一定時間後に自動検索
    useEffect(() => {
        if (query.trim().length < MIN_QUERY_LENGTH) {
            setResults([]);
            return;
        }
        const timer = setTimeout(() => {
            handleSearch(query);
        }, DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    const clearResults = useCallback(() => {
        setResults([]);
        setQuery('');
    }, []);

    return { query, setQuery, results, loading, handleSearch, clearResults };
};
