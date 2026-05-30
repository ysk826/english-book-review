'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import Header from '@/components/Header';
import BookInfoDisplay from '@/components/BookInfoDisplay';
import UserReviewDisplay from '@/components/UserReviewDisplay';
import { useBookDetail } from '@/hooks/useBookDetail';
import { useUserBookEntry } from '@/hooks/useUserBookEntry';
import { useWantToRead } from '@/hooks/useWantToRead';

function BookDetailContent() {
    const params = useParams();
    const { bookInfo, loading, displayImage } = useBookDetail();
    const { userBook, loading: userBookLoading, refetch } = useUserBookEntry(bookInfo?.id ?? '');
    const { adding, addToWantToRead } = useWantToRead(bookInfo ?? null, refetch);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500 text-sm">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!bookInfo) {
        notFound();
    }

    const reviewPath = `/books/${params.id}/${params.slug}/review`;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* 左サイドバー: 書影 + 感想ボタン */}
                    <aside className="flex-shrink-0 md:w-48 lg:w-52 md:sticky md:top-4 md:self-start">
                        <div className="w-36 md:w-full mx-auto mb-6">
                            {displayImage ? (
                                <Image
                                    src={displayImage}
                                    alt={bookInfo.title}
                                    width={208}
                                    height={312}
                                    className="w-full rounded-lg shadow-md"
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                            )}
                        </div>

                        <Link
                            href={reviewPath}
                            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                            </svg>
                            Review
                        </Link>

                        {userBook?.status === 'want_to_read' ? (
                            <button
                                disabled
                                className="flex items-center justify-center gap-1.5 w-full mt-2 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 text-sm font-medium cursor-default"
                            >
                                読みたい本に追加済み
                            </button>
                        ) : (
                            <button
                                onClick={addToWantToRead}
                                disabled={adding}
                                className="flex items-center justify-center gap-1.5 w-full mt-2 py-2.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {adding ? '追加中...' : '読みたい本に追加'}
                            </button>
                        )}
                    </aside>

                    {/* 右メイン: タイトル・著者・あらすじ・感想 */}
                    <main className="flex-1 min-w-0">
                        <BookInfoDisplay book={bookInfo} />
                        <UserReviewDisplay userBook={userBook} loading={userBookLoading} />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function BookDetailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            }
        >
            <BookDetailContent />
        </Suspense>
    );
}
