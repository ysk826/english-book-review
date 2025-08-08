'use client';
import Link from 'next/link';
import Head from 'next/head';
import { notFound } from 'next/navigation';
import BookInfoDisplay from '@/components/BookInfoDisplay';
import BookAddForm from '@/components/BookAddForm';
import { useBookLibrary } from '@/hooks/useBookLibrary';
import { useBookDetail } from '@/hooks/useBookDetail';

/**
 * 本の詳細ページコンポーネント
 * @usedBy BookSearchResults.tsx
 * @description URLパラメータとクエリパラメータから本の情報を取得して表示
 */
export default function BookDetailPage() {
    const { bookInfo, loading, displayImage } = useBookDetail();
    console.log('BookDetailPage', { bookInfo, loading, displayImage });
    // 本の情報が取得できない場合
    if (!bookInfo) {
        // 404ページを表示
        notFound();
    }

    const {
        saving,
        status,
        rating,
        review,
        setStatus,
        setRating,
        setReview,
        addBookToLibrary,
    } = useBookLibrary(bookInfo);

    // ローディング中の表示
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">本の情報を読み込んでいます...</p>
                </div>
            </div>
        );
    }

    // メタデータ用の情報生成
    const pageTitle = `${bookInfo.title} - Book Review`;
    const pageDescription = `Read reviews and details for "${bookInfo.title}" by ${bookInfo.authors.join(', ')}. Published in ${bookInfo.publishedDate}.`;
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

    // 構造化データ（JSON-LD）
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": bookInfo.title,
        "author": bookInfo.authors.map(author => ({
            "@type": "Person",
            "name": author.trim()
        })),
        "datePublished": bookInfo.publishedDate,
        ...(bookInfo.isbn13 && { "isbn": bookInfo.isbn13 }),
        ...(displayImage && { "image": displayImage }),
        "url": pageUrl
    };

    return (
        <>
            {/* SEO メタデータ */}
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={`${bookInfo.title}, ${bookInfo.authors.join(', ')}, book review, ${bookInfo.publishedDate}`} />

                {/* Open Graph (Facebook, LinkedIn等) */}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="book" />
                <meta property="og:url" content={pageUrl} />
                {displayImage && <meta property="og:image" content={displayImage} />}
                <meta property="og:site_name" content="Book Review" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                {displayImage && <meta name="twitter:image" content={displayImage} />}

                {/* 構造化データ */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* ヘッダー・ナビゲーション */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <Link
                            href="/profile"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            検索結果に戻る
                        </Link>
                    </div>
                </div>

                {/* メインコンテンツ */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        {/* 本の基本情報表示 */}
                        <BookInfoDisplay book={bookInfo} />

                        {/* フォーム部分 */}
                        <div className="mt-8">
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}