"use client";
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ログインページ
 */
export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * ログイン処理
     */
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        // フォームが送信される時のデフォルトの動作（ページのリロード）を防ぐ
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const email = (event.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
        const password = (event.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement;

        try {
            // Supabaseのログイン処理
            // dataにはsession情報(jwt、reflesh tokenなど)が含まれる
            // dataはCookieに保存され、以降のリクエストで自動的に認証される
            const { data: _loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });

            // ログインエラーチェック
            if (loginError) {
                setErrorMessage(loginError.message);
                return;
            }

            // ログイン成功時にプロフィールページに遷移
            router.replace('/profile');

        } catch (error) {
            console.error('ログインエラー:', error);
            setErrorMessage('予期しないエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
            <h1>ログイン</h1>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>メールアドレス</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>パスワード</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                        required
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        backgroundColor: loading ? '#ccc' : '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'ログイン中...' : 'ログイン'}
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                新規登録は<a href="/register" style={{ color: '#0070f3', textDecoration: 'underline' }}>こちら</a>
            </p>
        </div>
    );
}
