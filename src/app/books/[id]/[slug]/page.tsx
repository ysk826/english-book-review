'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import BookInfoDisplay from '@/components/BookInfoDisplay';
import BookAddForm from '@/components/BookAddForm';
import { useBookLibrary } from '@/hooks/useBookLibrary';
import { useBookDetail } from '@/hooks/useBookDetail';

function BookDetailContent() {
    const { bookInfo, loading, displayImage } = useBookDetail();

    const defaultBookInfo = {
        id: '',
        title: '',
        authors: [],
        publishedDate: '',
        isbn10: null,
        isbn13: null,
        issn: null,
        images: null,
        description: null,
        pageCount: null,
        publisher: null,
    };

    const {
        saving,
        status,
        rating,
        review,
        setStatus,
        setRating,
        setReview,
        addBookToLibrary,
    } = useBookLibrary(bookInfo || defaultBookInfo);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* 左サイドバー: 書影 + ライブラリ追加フォーム */}
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

                        <BookAddForm
                            status={status}
                            rating={rating}
                            review={review}
                            saving={saving}
                            onStatusChange={setStatus}
                            onRatingChange={setRating}
                            onReviewChange={setReview}
                            onSubmit={addBookToLibrary}
                        />
                    </aside>

                    {/* 右メイン: タイトル・著者・あらすじ */}
                    <main className="flex-1 min-w-0">
                        <BookInfoDisplay book={bookInfo} />
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
