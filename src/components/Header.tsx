'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useHeaderSearch } from '@/hooks/useHeaderSearch';
import { generateBookUrl } from '@/utils/slugify';
import { SearchResultBook } from '@/types/book';

const DROPDOWN_PAGE = 8;

export default function Header() {
    const [userName, setUserName] = useState<string | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const { query, setQuery, results, loading, clearResults } = useHeaderSearch();
    const [visibleCount, setVisibleCount] = useState(DROPDOWN_PAGE);

    useEffect(() => {
        const fetchUserName = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();
            if (data) {
                setUserName(data.name);
                setUserAvatar(data.avatar ?? null);
            }
        };
        fetchUserName();
    }, []);

    // 新しい検索結果が来たら表示数をリセット
    useEffect(() => {
        setVisibleCount(DROPDOWN_PAGE);
    }, [results]);

    // ドロップダウン末尾まで来たら追加表示
    useEffect(() => {
        const sentinel = sentinelRef.current;
        const container = dropdownRef.current;
        if (!sentinel || !container) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisibleCount(prev => Math.min(prev + DROPDOWN_PAGE, results.length));
                }
            },
            { root: container, threshold: 0.1 }
        );
        io.observe(sentinel);
        return () => io.disconnect();
    }, [results]);

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
        const bookUrl = generateBookUrl(book.dbId ?? (book.isbn13 || book.isbn10 || book.issn || 'unknown'), book.title);
        clearResults();

        if (book.dbId) {
            router.push(bookUrl);
            return;
        }

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
        router.push(`${bookUrl}?${searchParams.toString()}`);
    };

    const visibleResults = results.slice(0, visibleCount);

    return (
        <header className="bg-white border-b border-slate-200 shadow-sm relative z-40" style={{boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
                {/* ロゴ */}
                <Link
                    href="/profile"
                    className="flex items-center gap-2 font-bold text-slate-800 hover:text-teal-600 transition-colors shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 256 256"><path d="M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z"></path></svg>
                    <span className="hidden sm:inline">Stride Log</span>
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
                        <div
                            ref={dropdownRef}
                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-96 overflow-y-auto"
                        >
                            {loading ? (
                                <div className="p-4 text-center text-sm text-slate-500">検索中...</div>
                            ) : (
                                <>
                                    {visibleResults.map((book, index) => {
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
                                    })}
                                    {/* 末尾まで来たら次の8件を表示するセンチネル */}
                                    <div ref={sentinelRef} className="h-1" />
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* ユーザー情報 */}
                <div className="flex items-center gap-4 shrink-0">
                    {userName && (
                        <Link href="/profile" title={`${userName} のプロフィール`} className="shrink-0">
                            {userAvatar ? (
                                <Image
                                    src={userAvatar}
                                    alt={userName}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-teal-600 transition"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:ring-2 hover:ring-teal-600 transition">
                                    <span className="text-gray-600 text-sm font-medium">{userName.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-sm text-slate-500 hover:text-teal-600 transition-colors"
                    >
                        ログアウト
                    </button>
                </div>
            </div>
        </header>
    );
}
