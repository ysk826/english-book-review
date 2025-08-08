import type { BookAddFormProps } from "@/types/props";

/**
 * 本をマイライブラリに追加するためのフォームコンポーネント
 *
 * 読書ステータス、評価、レビューを入力し、マイライブラリに追加する機能を提供
 */
export default function BookAddForm({
    status,
    rating,
    review,
    saving,
    onStatusChange,
    onRatingChange,
    onReviewChange,
    onSubmit
}: BookAddFormProps) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    読書ステータス
                </label>
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="read">読了</option>
                    <option value="reading">読書中</option>
                    <option value="want_to_read">読みたい</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    評価 (1-5)
                </label>
                <select
                    value={rating || 0} // 0は評価なしを意味する
                    onChange={(e) => onRatingChange(Number(e.target.value))}
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

            <div>
                <label className="block text-sm font-medium mb-2">
                    レビュー（任意）
                </label>
                <textarea
                    value={review}
                    onChange={(e) => onReviewChange(e.target.value)}
                    placeholder="この本の感想を書いてください..."
                    className="w-full p-2 border rounded h-24 resize-none"
                />
            </div>

            <div>
                <button
                    onClick={onSubmit}
                    disabled={saving}
                    className="w-full p-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    {saving ? "追加中..." : "マイライブラリに追加"}
                </button>
            </div>
        </div>
    );
}
