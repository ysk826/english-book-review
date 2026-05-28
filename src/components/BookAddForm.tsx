import type { BookAddFormProps } from "@/types/props";

export default function BookAddForm({
    status,
    rating,
    saving,
    review,
    onStatusChange,
    onRatingChange,
    onReviewChange,
    onSubmit
}: BookAddFormProps) {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="status" className="block text-xs font-medium text-gray-500 mb-1.5">読書ステータス</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="read">読了</option>
                    <option value="reading">読書中</option>
                    <option value="want_to_read">読みたい</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">評価</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => onRatingChange(n === rating ? 0 : n)}
                            className="text-2xl leading-none focus:outline-none transition-colors"
                        >
                            <span className={n <= rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="review" className="block text-xs font-medium text-gray-500 mb-1.5">レビュー（任意）</label>
                <textarea
                    id="review"
                    value={review}
                    onChange={(e) => onReviewChange(e.target.value)}
                    placeholder="この本の感想を書いてください..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                onClick={onSubmit}
                disabled={saving}
                className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {saving ? "追加中..." : "マイライブラリに追加"}
            </button>
        </div>
    );
}
