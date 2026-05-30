import { UserBook } from '@/types/database';

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

function StarRow({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`text-lg ${n <= rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
            ))}
        </div>
    );
}

interface UserReviewDisplayProps {
    userBook: UserBook | null;
    loading: boolean;
}

export default function UserReviewDisplay({ userBook, loading }: UserReviewDisplayProps) {
    if (loading) {
        return (
            <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="h-4 bg-gray-100 rounded w-24 animate-pulse mb-4" />
                <div className="h-3 bg-gray-100 rounded w-40 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">あなたの感想</h2>

            {!userBook ? (
                <p className="text-sm text-gray-400">まだ感想がありません</p>
            ) : (
                <div className="space-y-3">
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[userBook.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABEL[userBook.status] ?? userBook.status}
                    </span>

                    {userBook.rating ? (
                        <StarRow rating={userBook.rating} />
                    ) : (
                        <p className="text-sm text-gray-400">評価なし</p>
                    )}

                    {userBook.review ? (
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{userBook.review}</p>
                    ) : (
                        <p className="text-sm text-gray-400">感想テキストなし</p>
                    )}
                </div>
            )}
        </div>
    );
}
