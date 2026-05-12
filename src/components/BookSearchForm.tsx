"use client";
import { BookSearchFormProps } from "@/types/props";

/**
 * 本の検索フォーム（プレゼンテーショナルコンポーネント）
 * @usedby app/profile/page.tsx
 */
export default function BookSearchForm({
    titleQuery,
    setTitleQuery,
    authorQuery,
    setAuthorQuery,
    loading,
    handleSearchBook
}: BookSearchFormProps) {

    return (
        <div className="max-w-4xl p-4 border rounded-lg mx-auto mb-8">
            <h2 className="text-lg mb-4">読んだ本を追加</h2>
            <div className="space-y-4">

                {/* タイトル入力欄 */}
                <div>
                    <label htmlFor="book-title" className="block text-sm font-medium mb-1">
                        タイトル
                    </label>
                    <input
                        id="book-title"
                        type="text"
                        placeholder="本のタイトルを入力"
                        value={titleQuery}
                        onChange={e => setTitleQuery(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                {/* 著者入力欄 */}
                <div>
                    <label htmlFor="book-author" className="block text-sm font-medium mb-1">
                        著者
                    </label>
                    <input
                        id="book-author"
                        type="text"
                        placeholder="著者名を入力"
                        value={authorQuery}
                        onChange={e => setAuthorQuery(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                {/* 検索ボタン */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSearchBook}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "検索中..." : "検索"}
                    </button>
                </div>
            </div>
        </div>
    );
}