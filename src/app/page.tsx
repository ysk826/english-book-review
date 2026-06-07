import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">

            {/* ナビゲーション */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z" />
                    </svg>
                    <span className="font-bold text-lg tracking-tight">Stride Log</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        ログイン
                    </Link>
                    <Link
                        href="/register"
                        className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        新規登録
                    </Link>
                </div>
            </header>

            {/* ヒーローセクション */}
            <section className="bg-slate-50 flex-1 flex items-center min-h-[80vh]">
                <div className="max-w-5xl mx-auto px-8 py-24 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* 左: コピー + CTA */}
                    <div>
                        <p className="text-teal-600 text-sm font-semibold tracking-widest uppercase mb-4">洋書読書管理アプリ</p>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight mb-6">
                            読んだ本を記録して、<br />
                            <span className="text-teal-600">次の一冊</span>を見つけよう。
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed mb-10">
                            Google Books と連携した書籍検索で、読んだ本・読書中・積読をかんたんに管理。レビューを書いて、読書体験を蓄積しよう。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/register"
                                className="px-8 py-3.5 text-base font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors text-center"
                            >
                                無料ではじめる
                            </Link>
                            <Link
                                href="/login"
                                className="px-8 py-3.5 text-base font-semibold text-slate-600 border border-slate-200 rounded-xl hover:border-slate-400 hover:text-slate-800 bg-white transition-colors text-center"
                            >
                                ログイン
                            </Link>
                        </div>
                    </div>

                    {/* 右: 装飾的なブックカード */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="relative w-64 h-72">
                            {/* 一番後ろ */}
                            <div className="absolute inset-0 bg-teal-100 rounded-2xl rotate-6 translate-x-4 translate-y-2" />
                            {/* 中間 */}
                            <div className="absolute inset-0 bg-teal-200 rounded-2xl rotate-3 translate-x-2" />
                            {/* 前面カード */}
                            <div className="absolute inset-0 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col justify-between p-6">
                                <div>
                                    <div className="w-12 h-1.5 bg-teal-500 rounded mb-3" />
                                    <div className="w-3/4 h-1.5 bg-slate-200 rounded mb-2" />
                                    <div className="w-1/2 h-1.5 bg-slate-200 rounded" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill={i < 4 ? '#0d9488' : '#e2e8f0'} viewBox="0 0 256 256">
                                                <path d="M243.33,90.91a16,16,0,0,0-13.72-11L165.28,73.56,137.87,15.16a16,16,0,0,0-28.74,0L81.72,73.56l-64.33,6.36a16,16,0,0,0-9.08,27.86l47.37,43.22-13.22,63.73a16,16,0,0,0,23.78,17.23L128,198.4l62.76,33.16a16,16,0,0,0,23.78-17.23l-13.22-63.73,47.37-43.22A16,16,0,0,0,243.33,90.91Z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded" />
                                    <div className="w-5/6 h-1.5 bg-slate-100 rounded" />
                                    <div className="w-4/6 h-1.5 bg-slate-100 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* フィーチャーセクション */}
            <section className="bg-white py-24 px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 text-center mb-4">シンプルに、続けられる。</h2>
                    <p className="text-slate-500 text-center mb-14">学習コストゼロ。初見で使えるインターフェース。</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                title: '書籍検索',
                                desc: 'Google Books と連携。タイトルや著者名でかんたんに検索して、ライブラリに追加できます。',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M229.66,218.34l-50.07-50.07a88.21,88.21,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                                    </svg>
                                ),
                            },
                            {
                                title: 'レビュー記録',
                                desc: '評価（1〜5）とテキストで感想を記録。読書の記憶を蓄積して、自分だけの読書ログを作ろう。',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M243.33,90.91a16,16,0,0,0-13.72-11L165.28,73.56,137.87,15.16a16,16,0,0,0-28.74,0L81.72,73.56l-64.33,6.36a16,16,0,0,0-9.08,27.86l47.37,43.22-13.22,63.73a16,16,0,0,0,23.78,17.23L128,198.4l62.76,33.16a16,16,0,0,0,23.78-17.23l-13.22-63.73,47.37-43.22A16,16,0,0,0,243.33,90.91Z" />
                                    </svg>
                                ),
                            },
                            {
                                title: '読書リスト',
                                desc: '読了・読書中・積読をステータスで一覧管理。本が増えても見やすく整理できます。',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M224,128a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM104,72H216a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16ZM216,184H104a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,116a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0-56a12,12,0,1,0,12,12A12,12,0,0,0,44,60Zm0,112a12,12,0,1,0,12,12A12,12,0,0,0,44,172Z" />
                                    </svg>
                                ),
                            },
                        ].map((f) => (
                            <div key={f.title} className="bg-slate-50 rounded-2xl p-6 text-left">
                                <div className="text-teal-600 mb-4">{f.icon}</div>
                                <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA バナー */}
            <section className="bg-teal-600 py-20 px-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">さっそく始めよう</h2>
                <p className="text-teal-100 mb-8">無料で、今すぐ使えます。</p>
                <Link
                    href="/register"
                    className="inline-block px-10 py-4 text-base font-semibold text-teal-700 bg-white rounded-xl hover:bg-teal-50 transition-colors"
                >
                    アカウントを作成する
                </Link>
            </section>

            <footer className="bg-slate-800 text-center py-6 text-xs text-slate-400">
                © 2025 Stride Log
            </footer>
        </div>
    );
}
