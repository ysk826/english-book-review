export default function LoginPage() {
    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
            <h1>ログイン</h1>
            <form>
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
                <button type="submit" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    ログイン
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                新規登録は<a href="/register" style={{ color: '#0070f3', textDecoration: 'underline' }}>こちら</a>
            </p>
        </div>
    );
}
