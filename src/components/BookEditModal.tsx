"use client";
import { useEffect, useState } from 'react';
import { BookEditModalProps } from '@/types/props';
import Image from 'next/image';
export default function BookEditModal({ isOpen, book, onClose, onSave }: BookEditModalProps) {
    const [editingStatus, setEditingStatus] = useState(book ? book.status : "read");
    const [editingRating, setEditingRating] = useState(book ? book.rating : 0);
    const [editingReview, setEditingReview] = useState(book ? book.review : "");

    // モーダルが開いていない場合は何も表示しない
    if (!isOpen || !book) return null;

    // 背景クリックでモーダルを閉じる処理
    const handleBackdropClick = (e: React.MouseEvent) => {
        // 背景クリックでモーダルを閉じる
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // 保存ボタン: 編集内容を保存し、モーダルを閉じる
    const handleSave = () => {
        const updatedData = {
            ...book,
            status: editingStatus,
            rating: editingRating,
            review: editingReview,
        };
        onSave(updatedData);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ヘッダー */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">感想を編集</h3>
                </div>

                {/* 編集中の本の情報を表示 */}
                <div className="flex gap-4 p-4 mb-4">
                    {book?.books?.thumbnail && (
                        <Image
                            src={book.books.thumbnail?.smallThumbnail || book.books.thumbnail?.thumbnail || '/placeholder.png'}
                            alt={book.books.title}
                            width={400}
                            height={600}
                            className="w-20 h-28 object-cover flex-shrink-0"
                        />
                    )}
                    <div>
                        <h4 className="font-medium text-sm text-gray-600">
                            {book?.books?.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {book?.books?.authors?.join(", ")}
                        </p>
                    </div>
                </div>

                {/* フォーム */}
                <div className="space-y-4">
                    {/* ステータス選択 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            読書ステータス
                        </label>
                        <select
                            value={editingStatus}
                            onChange={(e) => setEditingStatus(e.target.value as "want_to_read" | "reading" | "read")}
                            className="w-full p-2 border rounded"
                        >
                            <option value="read">読了</option>
                            <option value="reading">読書中</option>
                            <option value="want_to_read">読みたい</option>
                        </select>
                    </div>

                    {/* 評価選択 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            評価 (1-5)
                        </label>
                        <select
                            value={editingRating != null ? editingRating : 0} // 0は評価なしを意味する
                            onChange={(e) => setEditingRating(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                        >
                            <option value={0}>評価なし</option>
                            <option value={1}>⭐ 1</option>
                            <option value={2}>⭐ 2</option>
                            <option value={3}>⭐ 3</option>
                            <option value={4}>⭐ 4</option>
                            <option value={5}>⭐ 5</option>
                        </select>
                    </div>

                    {/* 感想入力 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            感想
                        </label>
                        <textarea
                            value={editingReview != null ? editingReview : ""}
                            onChange={(e) => setEditingReview(e.target.value)}
                            placeholder="この本の感想を書いてください..."
                            className="w-full p-2 border rounded h-24 resize-none"
                        />
                    </div>

                    {/* ボタン */}
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}