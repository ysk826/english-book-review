'use client';
import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Header from '@/components/Header';
import { SearchResultBook } from '@/types/book';
import { generateBookUrl } from '@/utils/slugify';

const PAGE_SIZE = 20;

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const router = useRouter();
    const [results, setResults] = useState<SearchResultBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    // refで管理することでstale closureを避ける
    const nextStartIndexRef = useRef(0);
    const hasMoreRef = useRef(false);
    const fetchingRef = useRef(false);

    const fetchBooks = useCallback(async (startIndex: number) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        if (startIndex === 0) setLoading(true);
        else setLoadingMore(true);

        try {
            const { data } = await axios.get(
                `/api/books?q=${encodeURIComponent(query)}&startIndex=${startIndex}`
            );
            const items: SearchResultBook[] = data.items || [];

            if (startIndex === 0) {
                setResults(items);
            } else {
                // ISBNで重複除去しながらアペンド
                setResults(prev => {
                    const seenIsbns = new Set(
                        prev.map(b => b.isbn13 || b.isbn10 || b.issn).filter(Boolean)
                    );
                    const newItems = items.filter(b => {
                        const isbn = b.isbn13 || b.isbn10 || b.issn;
                        return !isbn || !seenIsbns.has(isbn);
                    });
                    return [...prev, ...newItems];
                });
            }

            hasMoreRef.current = data.hasMore ?? false;
            nextStartIndexRef.current = startIndex + PAGE_SIZE;
        } catch {
            // silently ignore
        } finally {
            fetchingRef.current = false;
            setLoading(false);
            setLoadingMore(false);
        }
    }, [query]);

    // クエリ変更時にリセットして初回フェッチ
    useEffect(() => {
        if (!query.trim()) return;
        nextStartIndexRef.current = 0;
        hasMoreRef.current = false;
        fetchBooks(0);
    }, [query, fetchBooks]);

    // 末尾センチネルへの到達で次のページをフェッチ
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting && hasMoreRef.current && !fetchingRef.current) {
                    fetchBooks(nextStartIndexRef.current);
                }
            },
            { threshold: 0.1 }
        );
        io.observe(sentinel);
        return () => io.disconnect();
    }, [fetchBooks]);

    const handleBookClick = (book: SearchResultBook) => {
        const bookUrl = generateBookUrl(book.dbId ?? (book.isbn13 || book.isbn10 || book.issn || 'unknown'), book.title);

        if (book.dbId) {
            router.push(bookUrl);
            return;
        }

        const params = new URLSearchParams({
            title: book.title,
            authors: book.authors.join(','),
            publishedDate: book.publishedDate,
            ...(book.images.smallThumbnail && { smallThumbnail: book.images.smallThumbnail }),
            ...(book.images.thumbnail && { thumbnail: book.images.thumbnail }),
            ...(book.isbn10 && { isbn10: book.isbn10 }),
            ...(book.isbn13 && { isbn13: book.isbn13 }),
            ...(book.issn && { issn: book.issn }),
        });
        router.push(`${bookUrl}?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-xl font-bold text-slate-800 mb-6">
                    「{query}」の検索結果
                </h1>
                {loading ? (
                    <div className="text-center py-16 text-slate-500">検索中...</div>
                ) : results.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        該当する書籍が見つかりませんでした
                    </div>
                ) : (
                    <>
                        <ul className="grid gap-3">
                            {results.map((book, index) => {
                                const imageUrl = book.images.smallThumbnail || book.images.thumbnail;
                                return (
                                    <li key={book.isbn13 || book.isbn10 || book.issn || index}>
                                        <button
                                            onClick={() => handleBookClick(book)}
                                            className="w-full flex items-center gap-4 bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow text-left"
                                        >
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={book.title}
                                                    width={48}
                                                    height={64}
                                                    className="w-12 h-16 object-cover rounded shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-16 bg-slate-100 rounded shrink-0 flex items-center justify-center text-slate-400 text-lg">
                                                    📖
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-800 truncate">{book.title}</p>
                                                <p className="text-sm text-slate-500 truncate">{book.authors.join(', ')}</p>
                                                <p className="text-sm text-slate-400">{book.publishedDate}</p>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        {loadingMore && (
                            <div className="text-center py-6 text-slate-400 text-sm">読み込み中...</div>
                        )}
                        {/* 末尾センチネル: ここに到達したら次のページをフェッチ */}
                        <div ref={sentinelRef} className="h-4" />
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                読み込み中...
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
