'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useHeaderSearch } from '@/hooks/useHeaderSearch';
import { generateBookUrl } from '@/utils/slugify';
import { SearchResultBook } from '@/types/book';

export default function Header() {
    const [userName, setUserName] = useState<string | null>(null);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const { query, setQuery, results, loading, clearResults } = useHeaderSearch();

    useEffect(() => {
        const fetchUserName = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from('profiles')
                .select('name')
                .eq('user_id', user.id)
                .single();
            if (data) setUserName(data.name);
        };
        fetchUserName();
    }, []);

    // ドロップダウン外クリックで閉じる
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                clearResults();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [clearResults]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        clearResults();
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    };

    const handleBookClick = (book: SearchResultBook) => {
        const bookId = book.isbn13 || book.isbn10 || book.issn || 'unknown';
        const bookUrl = generateBookUrl(bookId, book.title);
        const searchParams = new URLSearchParams({
            title: book.title,
            authors: book.authors.join(','),
            publishedDate: book.publishedDate,
            ...(book.images.smallThumbnail && { smallThumbnail: book.images.smallThumbnail }),
            ...(book.images.thumbnail && { thumbnail: book.images.thumbnail }),
            ...(book.isbn10 && { isbn10: book.isbn10 }),
            ...(book.isbn13 && { isbn13: book.isbn13 }),
            ...(book.issn && { issn: book.issn }),
        });
        clearResults();
        router.push(`${bookUrl}?${searchParams.toString()}`);
    };

    return (
        <header className="bg-white border-b shadow-sm relative z-40">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
                {/* ロゴ */}
                <Link
                    href="/profile"
                    className="flex items-center gap-2 font-bold text-slate-800 hover:text-blue-600 transition-colors shrink-0"
                >
                    <span className="text-xl">📚</span>
                    <span className="hidden sm:inline">English Book Review</span>
                </Link>

                {/* 検索 */}
                <div ref={searchRef} className="flex-1 relative">
                    <form onSubmit={handleSubmit} className="flex items-center">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="タイトル・著者で検索"
                                className="w-full pl-4 pr-10 py-2 text-sm border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition"
                            />
                            {query ? (
                                <button
                                    type="button"
                                    onClick={clearResults}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                                >
                                    🔍
                                </button>
                            )}
                        </div>
                    </form>

                    {/* ドロップダウン */}
                    {(results.length > 0 || loading) && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-sm text-slate-500">検索中...</div>
                            ) : (
                                results.map((book, index) => {
                                    const imageUrl = book.images.smallThumbnail || book.images.thumbnail;
                                    return (
                                        <button
                                            key={book.isbn13 || book.isbn10 || book.issn || index}
                                            onClick={() => handleBookClick(book)}
                                            className="group w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0"
                                        >
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={book.title}
                                                    width={40}
                                                    height={56}
                                                    className="w-10 h-14 object-cover rounded shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 bg-slate-100 rounded shrink-0 flex items-center justify-center text-slate-400 text-xs">
                                                    📖
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 group-hover:font-bold truncate transition-colors">{book.title}</p>
                                                <p className="text-xs text-slate-500 group-hover:text-blue-500 group-hover:font-bold truncate transition-colors">{book.authors.join(', ')}</p>
                                                <p className="text-xs text-slate-400">{book.publishedDate}</p>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                {/* ユーザー情報 */}
                <div className="flex items-center gap-4 shrink-0">
                    {userName && (
                        <span className="text-sm text-slate-600 hidden sm:inline">
                            {userName} さん
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        ログアウト
                    </button>
                </div>
            </div>
        </header>
    );
}
