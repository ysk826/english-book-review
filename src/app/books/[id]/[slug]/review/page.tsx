'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import { useBookDetail } from '@/hooks/useBookDetail';
import { useUserBookEntry } from '@/hooks/useUserBookEntry';
import { useReviewForm } from '@/hooks/useReviewForm';

const STATUS_OPTIONS = [
    { value: 'read', label: '読了' },
    { value: 'reading', label: '読書中' },
    { value: 'want_to_read', label: '読みたい' },
];

function StarSelector({ rating, onChange }: { rating: number; onChange: (n: number) => void }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onChange(n === rating ? 0 : n)}
                    className="text-3xl leading-none focus:outline-none transition-colors"
                >
                    <span className={n <= rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                </button>
            ))}
        </div>
    );
}

function ReviewFormContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const qs = searchParams.toString();
    const backUrl = `/books/${params.id}/${params.slug}${qs ? `?${qs}` : ''}`;

    const { bookInfo, loading: bookLoading } = useBookDetail();
    const { userBook, loading: entryLoading } = useUserBookEntry(bookInfo?.id ?? '');
    const { status, rating, review, saving, setStatus, setRating, setReview, save, deleteEntry } =
        useReviewForm(bookInfo, userBook);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (bookLoading || entryLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!bookInfo) notFound();

    return (
        <>
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* 本のコンテキスト */}
                <div className="mb-6">
                    <Link href={backUrl} className="text-sm text-blue-500 hover:underline">
                        ← {bookInfo.title} に戻る
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 mt-2">{bookInfo.title}</h1>
                    <p className="text-sm text-gray-500">{bookInfo.authors.join(', ')}</p>
                </div>

                {/* フォームカード */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                    {/* ステータス */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            読書ステータス
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* 星評価 */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">評価</p>
                        <StarSelector rating={rating} onChange={setRating} />
                        {rating > 0 && (
                            <button
                                type="button"
                                onClick={() => setRating(0)}
                                className="mt-1 text-xs text-gray-400 hover:text-gray-600"
                            >
                                評価をクリア
                            </button>
                        )}
                    </div>

                    {/* 感想テキスト */}
                    <div>
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                            感想
                        </label>
                        <textarea
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="この本の感想を書いてください..."
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* ボタン */}
                    <div className="flex items-center pt-2">
                        {userBook && (
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                disabled={saving}
                                className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                            >
                                削除する
                            </button>
                        )}
                        <div className="flex gap-3 ml-auto">
                            <Link
                                href={backUrl}
                                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                キャンセル
                            </Link>
                            <button
                                onClick={save}
                                disabled={saving}
                                className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? '保存中...' : '保存する'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            {/* 削除確認モーダル */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-80">
                        <p className="text-gray-800 font-medium mb-1">本当に削除しますか？</p>
                        <p className="text-sm text-gray-500 mb-6">この本の読書記録がライブラリから削除されます。</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                いいえ
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowDeleteModal(false); deleteEntry(); }}
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                            >
                                はい
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function ReviewPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                </div>
            }
        >
            <ReviewFormContent />
        </Suspense>
    );
}
