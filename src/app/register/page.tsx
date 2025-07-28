"use client";
import { supabase } from '../../lib/supabase';
import { useState } from 'react';

export default function RegisterPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const name = (event.target as HTMLFormElement).elements.namedItem('name') as HTMLInputElement;
        const email = (event.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
        const password = (event.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement;

        try {
            // 1. ユーザー登録
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
            });

            if (authError) {
                setErrorMessage(authError.message);
                return;
            }

            if (!authData.user) {
                setErrorMessage('ユーザー作成に失敗しました');
                return;
            }

            // 2. 登録直後にログイン（セッション確立）
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });

            if (loginError) {
                console.error('ログインエラー:', loginError);
                setErrorMessage('ユーザー登録は成功しましたが、ログインに失敗しました');
                return;
            }

            // 3. セッション確立後にプロフィール保存
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        user_id: loginData.user.id,
                        name: name.value,
                    }
                ]);

            if (profileError) {
                console.error('プロフィール保存エラー:', profileError);
                setErrorMessage(`プロフィール保存エラー: ${profileError.message}`);
            } else {
                alert('登録が成功しました！');
                // フォームをクリア
                (event.target as HTMLFormElement).reset();
            }

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
                既にアカウントをお持ちですか？<a href="/login" style={{ color: '#0070f3', textDecoration: 'underline' }}>ログインはこちら</a>
            </p>
        </div>
    );
}