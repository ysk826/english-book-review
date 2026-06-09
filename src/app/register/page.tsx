"use client";
import { supabase } from '../../lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { mapAuthError } from '@/utils/mapAuthError';

export default function RegisterPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const name = (event.target as HTMLFormElement).elements.namedItem('name') as HTMLInputElement;
        const email = (event.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
        const password = (event.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement;

        try {
            // supabaseのユーザー登録
            const { data: _authData, error: authError } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
            });

            // 登録エラーチェック
            if (authError) {
                setErrorMessage(mapAuthError(authError.message));
                return;
            }

            // supabaseのユーザー登録が成功した場合、ログインを試みる
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });

            // ログインエラーチェック
            if (loginError) {
                console.error('ログインエラー:', loginError);
                setErrorMessage('ユーザー登録は成功しましたが、ログインに失敗しました');
                return;
            }

            // profilesのuser_idにログインしたユーザーのIDを保存、nameに入力された名前を保存
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        user_id: loginData.user.id,
                        name: name.value,
                    }
                ]);

            // プロフィール保存エラーチェック
            if (profileError) {
                console.error('プロフィール保存エラー:', profileError);
                setErrorMessage(`プロフィール保存エラー: ${profileError.message}`);
                return;
            }
            toast.success('登録が成功しました！');

            router.push('/profile');

        } catch (error) {
            console.error('登録エラー:', error);
            setErrorMessage('予期しないエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* ロゴ・ブランディング */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 text-slate-800 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z" />
                        </svg>
                        <span className="text-2xl font-bold tracking-tight">Stride Log</span>
                    </div>
                    <p className="text-slate-500 text-sm">洋書の記録をはじめよう。</p>
                </div>

                {/* 登録カード */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">新規登録</h2>

                    <form onSubmit={handleRegister} className="space-y-5">

                        {/* 名前 */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1.5">
                                名前
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="山田 太郎"
                                autoComplete="name"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* メールアドレス */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1.5">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="example@mail.com"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* パスワード */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1.5">
                                パスワード（6文字以上）
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                minLength={6}
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* エラーメッセージ */}
                        {errorMessage && (
                            <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">
                                {errorMessage}
                            </p>
                        )}

                        {/* 登録ボタン */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? '登録中...' : '登録'}
                        </button>
                    </form>

                    {/* ログインリンク */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        既にアカウントをお持ちですか？{' '}
                        <Link href="/login" className="text-teal-600 hover:underline font-medium">
                            ログインはこちら
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}