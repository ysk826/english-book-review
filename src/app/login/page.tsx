"use client";
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const email = (event.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
        const password = (event.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement;

        try {
            const { data: _loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });

            if (loginError) {
                setErrorMessage(loginError.message);
                return;
            }

            router.replace('/profile');
        } catch (error) {
            console.error('ログインエラー:', error);
            setErrorMessage('予期しないエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* ロゴ・ブランディング */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">📚</div>
                    <h1 className="text-2xl font-bold text-slate-800">Stride Log</h1>
                    <p className="text-slate-500 mt-1 text-sm">洋書の記録をはじめよう。</p>
                </div>

                {/* ログインカード */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-xl font-semibold text-slate-700 mb-6">ログイン</h2>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* メールアドレス */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-600 mb-1.5"
                            >
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="example@mail.com"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* パスワード */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-600 mb-1.5"
                            >
                                パスワード
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* エラーメッセージ */}
                        {errorMessage && (
                            <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">
                                {errorMessage}
                            </p>
                        )}

                        {/* ログインボタン */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'ログイン中...' : 'ログイン'}
                        </button>
                    </form>

                    {/* 新規登録リンク */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        アカウントをお持ちでない方は{' '}
                        <Link href="/register" className="text-blue-600 hover:underline font-medium">
                            新規登録
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
