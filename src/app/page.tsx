import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">

            {/* ナビゲーション */}
            <header className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    <span className="font-bold text-slate-800 text-lg">English Book Review</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        ログイン
                    </Link>
                    <Link
                        href="/register"
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        新規登録
                    </Link>
                </div>
            </header>

            {/* ヒーローセクション */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                <div className="max-w-2xl">
                    <div className="text-7xl mb-6">📖</div>
                    <h1 className="text-4xl font-bold text-slate-800 leading-tight mb-4">
                        洋書の記録を、<br />もっとたのしく。
                    </h1>
                    <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                        読んだ本・読書中・読みたい本をかんたんに管理。<br />
                        レビューを書いて、次の一冊を見つけよう。
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            無料ではじめる
                        </Link>
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            ログイン
                        </Link>
                    </div>
                </div>

                {/* フィーチャー */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
                    {[
                        { icon: '🔍', title: '書籍検索', desc: 'Google Books と連携。タイトルや著者名で素早く検索。' },
                        { icon: '⭐', title: 'レビュー記録', desc: '評価・コメントを残して、読書の記憶を蓄積しよう。' },
                        { icon: '📋', title: '読書リスト', desc: '読了・読書中・積読をステータスで一覧管理。' },
                    ].map((f) => (
                        <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm text-left">
                            <div className="text-3xl mb-3">{f.icon}</div>
                            <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="text-center py-8 text-xs text-slate-400">
                © 2025 English Book Review
            </footer>
        </div>
    );
}
