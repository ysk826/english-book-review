"use client";
import Image from "next/image";
import { SavedBooksListProps } from "@/types/props";
import { UserBookRecord } from "@/types/database";

/**
 * 読んだ本のリストを表示するコンポーネント
 * ユーザーが読んだ本の情報を一覧表示し、感想の編集機能を提供する
 * @usetdBy profile/page.tsx
 * @param books - ユーザーが読んだ本のリスト
 * @param onEditBook - 本の感想を編集するためのコールバック関数
 */
export default function SavedBooksList({ savedBooks, onEditBook }: SavedBooksListProps) {

    return (
        <div>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-lg mb-4">読んだ本</h2>
                {savedBooks.length === 0 ? (
                    <p>まだ本が登録されていません</p>
                ) : (
                    <div className="grid gap-4">
                        {savedBooks.map((book: UserBookRecord) => {
                            return (
                                <div
                                    key={book.book_id}
                                    className="flex gap-4 p-4 border rounded"
                                >
                                    {/* 左側: 画像 */}
                                    {book.books && (
                                        <Image
                                            src={book.books.thumbnail?.smallThumbnail || book.books.thumbnail?.thumbnail || '/placeholder.png'}
                                            alt={book.books.title}
                                            width={400}
                                            height={600}
                                            className="w-20 h-28 object-cover flex-shrink-0"
                                        />
                                    )}

                                    {/* 中央: 本の基本情報 */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold">{book.books?.title}</h3>
                                        <p className="text-gray-600">
                                            {book.books?.authors.join(", ")}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {book.books?.published_date}
                                        </p>

                                        {/* ステータス表示 */}
                                        {book.status && (
                                            <p className="text-sm text-blue-600 mt-1">
                                                ステータス: {book.status}
                                            </p>
                                        )}

                                        {/* 評価表示 */}
                                        {book.rating && (
                                            <p className="text-sm text-yellow-600 mt-1">
                                                評価: {"⭐".repeat(book.rating)} ({book.rating}/5)
                                            </p>
                                        )}

                                        {/* 読了日表示 */}
                                        {book.finished_reading_at && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                読了日: {new Date(book.finished_reading_at).toLocaleDateString('ja-JP')}
                                            </p>
                                        )}
                                    </div>

                                    {/* 右側: レビューと編集ボタン */}
                                    <div className="w-80 p-3 bg-gray-50 rounded">
                                        {book.review ? (
                                            // 感想がある場合
                                            <div>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                                    {book.review}
                                                </p>
                                                <button
                                                    onClick={() => onEditBook(book)}
                                                    className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                                                >
                                                    編集
                                                </button>
                                            </div>
                                        ) : (
                                            // 感想がない場合
                                            <div>
                                                <button
                                                    onClick={() => onEditBook(book)}
                                                    className="text-sm text-blue-500 hover:text-blue-700 hover:underline border border-blue-300 px-3 py-1 rounded"
                                                >
                                                    編集
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}