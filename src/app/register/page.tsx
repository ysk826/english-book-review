"use client";
import { supabase } from '../../lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * 新規登録ページ
 */
export default function RegisterPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * ユーザー登録処理
     */
    const handleRegister = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        // フォームが送信される時のデフォルトの動作（ページのリロード）を防ぐ
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
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
            <h1>新規登録</h1>
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>名前</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                        required
                    />
                </div>
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
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>パスワード（6文字以上）</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        minLength={6}
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
                    {loading ? '登録中...' : '登録'}
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                既にアカウントをお持ちですか？
                <Link
                    href="/login"
                    style={{ color: '#0070f3', textDecoration: 'underline' }}
                >
                    ログインはこちら
                </Link>
            </p>
        </div>
    );
}