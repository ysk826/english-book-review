import Link from 'next/link';
export default function HomePage() {
    return (
        <div>
            <h1>Welcome to English Book Review</h1>
            <p>英語書籍レビューサイトへようこそ！</p>
            <Link href="/login">ログイン</Link>
        </div>
    );
}