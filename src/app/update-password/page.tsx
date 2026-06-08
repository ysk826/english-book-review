'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function UpdatePasswordPage() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');

        const form = e.target as HTMLFormElement;
        const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
        const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

        if (newPassword !== confirmPassword) {
            setErrorMessage('パスワードが一致しません');
            return;
        }
        if (newPassword.length < 6) {
            setErrorMessage('パスワードは6文字以上で入力してください');
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
        setTimeout(() => router.push('/login'), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 text-slate-800 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z" />
                        </svg>
                        <span className="text-2xl font-bold tracking-tight">Stride Log</span>
                    </div>
                    <p className="text-slate-500 text-sm">洋書の記録をはじめよう。</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="text-teal-600 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256" className="mx-auto">
                                    <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">パスワードを変更しました</h2>
                            <p className="text-slate-500 text-sm">ログインページに移動します...</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">新しいパスワードを設定</h2>
                            <p className="text-slate-500 text-sm mb-6">新しいパスワードを入力してください。</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-600 mb-1.5">
                                        新しいパスワード（6文字以上）
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-[2.5px] focus:ring-teal-600 focus:ring-offset-0 focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600 mb-1.5">
                                        新しいパスワード（確認）
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-[2.5px] focus:ring-teal-600 focus:ring-offset-0 focus:border-transparent transition"
                                    />
                                </div>

                                {errorMessage && (
                                    <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">
                                        {errorMessage}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? '変更中...' : 'パスワードを変更する'}
                                </button>
                            </form>

                            <p className="text-center text-sm text-slate-500 mt-6">
                                <Link href="/login" className="text-teal-600 hover:underline font-medium">
                                    ログインに戻る
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
