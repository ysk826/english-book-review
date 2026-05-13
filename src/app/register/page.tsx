"use client";
import { supabase } from '../../lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
                setErrorMessage(authError.message);
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
            alert('登録が成功しました！');

            router.push('/profile');

        } catch (error) {
            console.error('登録エラー:', error);
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
                    <h1 className="text-2xl font-bold text-slate-800">English Book Review</h1>
                    <p className="text-slate-500 mt-1 text-sm">洋書の記録をはじめよう。</p>
                </div>

                {/* 登録カード */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-xl font-semibold text-slate-700 mb-6">新規登録</h2>

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
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                                minLength={6}
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

                        {/* 登録ボタン */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? '登録中...' : '登録'}
                        </button>
                    </form>

                    {/* ログインリンク */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        既にアカウントをお持ちですか？{' '}
                        <Link href="/login" className="text-blue-600 hover:underline font-medium">
                            ログインはこちら
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}