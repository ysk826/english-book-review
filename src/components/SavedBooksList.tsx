"use client";
import Image from "next/image";
import { SavedBooksListProps } from "@/types/props";
import { UserBookRecord } from "@/types/database";

const STATUS_LABEL: Record<string, string> = {
    read: '読了',
    reading: '読書中',
    want_to_read: '読みたい',
};

const STATUS_COLOR: Record<string, string> = {
    read: 'bg-emerald-100 text-emerald-700',
    reading: 'bg-blue-100 text-blue-700',
    want_to_read: 'bg-amber-100 text-amber-700',
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= rating ? 'text-yellow-400' : 'text-gray-200'}>
                    ★
                </span>
            ))}
        </div>
    );
}

export default function SavedBooksList({ savedBooks, loading, onEditBook }: SavedBooksListProps) {
    if (loading) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold mb-5">読んだ本</h2>

            {savedBooks.length === 0 ? (
                <p className="text-gray-500 text-sm">まだ本が登録されていません</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {savedBooks.map((book: UserBookRecord) => {
                        const thumbnailUrl =
                            book.books?.thumbnail?.smallThumbnail ||
                            book.books?.thumbnail?.thumbnail;

                        return (
                            <div
                                key={book.book_id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                            >
                                {/* 書影 */}
                                <div className="relative w-full aspect-[2/3] bg-gray-100">
                                    {thumbnailUrl ? (
                                        <Image
                                            src={thumbnailUrl}
                                            alt={book.books?.title ?? ''}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* カード本文 */}
                                <div className="flex flex-col p-3 gap-1.5 h-36 overflow-hidden">
                                    {/* ステータスバッジ */}
                                    {book.status && (
                                        <span className={`self-start text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[book.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {STATUS_LABEL[book.status] ?? book.status}
                                        </span>
                                    )}

                                    {/* タイトル */}
                                    <p className="text-sm font-semibold leading-snug line-clamp-2">
                                        {book.books?.title}
                                    </p>

                                    {/* 著者 */}
                                    <p className="text-xs text-gray-500 line-clamp-1">
                                        {book.books?.authors.join(", ")}
                                    </p>

                                    {/* 星評価 */}
                                    {book.rating && (
                                        <StarRating rating={book.rating} />
                                    )}

                                    {/* レビューテキスト */}
                                    {book.review && (
                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mt-0.5">
                                            {book.review}
                                        </p>
                                    )}

                                    {/* 読了日 + 編集ボタン */}
                                    <div className="flex items-end justify-between mt-auto pt-2">
                                        {book.finished_reading_at ? (
                                            <span className="text-xs text-gray-400">
                                                {new Date(book.finished_reading_at).toLocaleDateString('ja-JP')}
                                            </span>
                                        ) : (
                                            <span />
                                        )}
                                        <button
                                            onClick={() => onEditBook(book)}
                                            className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                                        >
                                            編集
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
