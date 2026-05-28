'use client';
import { useState, useEffect, useRef } from 'react';
import type { BookAddFormProps } from "@/types/props";

function RatingToast({ selected, onDone }: { selected: number; onDone: () => void }) {
    const [leaving, setLeaving] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const onDoneRef = useRef(onDone);
    onDoneRef.current = onDone;

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            setLeaving(true);
            setTimeout(() => onDoneRef.current(), 300);
        }, 3000);
        return () => clearTimeout(timerRef.current);
    }, []);

    const handleClose = () => {
        clearTimeout(timerRef.current);
        setLeaving(true);
        setTimeout(() => onDoneRef.current(), 300);
    };

    return (
        <div
            className={`absolute left-0 top-full mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-100 w-44 overflow-hidden ${
                leaving
                    ? 'animate-[slide-out-right_0.3s_ease-in_forwards]'
                    : 'animate-[slide-in-right_0.3s_ease-out_forwards]'
            }`}
        >
            <div className="flex items-center justify-between px-3 pt-2.5 pb-2">
                <span className="text-sm font-medium text-gray-800">★{selected} を選択中</span>
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0 leading-none"
                    aria-label="閉じる"
                >
                    ✕
                </button>
            </div>
            <div className="h-0.5 bg-gray-100">
                <div className="h-full bg-blue-500 animate-[progress-drain_3s_linear_forwards]" />
            </div>
        </div>
    );
}

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
    const [toastKey, setToastKey] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState(0);

    const handleStarClick = (n: number) => {
        const next = n === rating ? 0 : n;
        onRatingChange(next);
        if (next > 0) {
            setSelectedRating(next);
            setToastKey(Date.now());
        } else {
            setToastKey(null);
        }
    };

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

            <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">評価</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => handleStarClick(n)}
                            className="text-2xl leading-none focus:outline-none transition-colors"
                        >
                            <span className={n <= rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                        </button>
                    ))}
                </div>
                {toastKey !== null && (
                    <RatingToast key={toastKey} selected={selectedRating} onDone={() => setToastKey(null)} />
                )}
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
