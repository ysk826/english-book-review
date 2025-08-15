"use client";
import { SearchResultBook, BookImages } from "@/types/book";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { generateBookUrl } from "@/utils/slugify";

/**
 * 検索結果表示コンポーネント
 * @usedBy app/profile/page.tsx
 * @param books 検索結果の本のリスト
 */
export default function BookSearchResults({ books }: { books: SearchResultBook[] }) {

    const router = useRouter();


    const getSmallestImage = (images: BookImages): string | null => {
        return images?.smallThumbnail || images?.thumbnail || null;
    };

    /**
     * 本をクリックした時の処理
     * 本の詳細ページに遷移し、URLパラメータで基本情報を渡す
     */
    const handleBookClick = (book: SearchResultBook) => {
        // 識別子の優先順位: ISBN13 > ISBN10 > ISSN > 'unknown'
        const bookId = book.isbn13 || book.isbn10 || book.issn || 'unknown';

        // SEO対応のURLを生成
        const bookUrl = generateBookUrl(bookId, book.title);

        // クエリパラメータで本の基本情報を渡す
        const searchParams = new URLSearchParams({
            title: book.title,
            authors: book.authors.join(','),
            publishedDate: book.publishedDate,
            ...(book.images.smallThumbnail && { smallThumbnail: book.images.smallThumbnail }),
            ...(book.images.thumbnail && { thumbnail: book.images.thumbnail }),
            ...(book.isbn10 && { isbn10: book.isbn10 }),
            ...(book.isbn13 && { isbn13: book.isbn13 }),
            ...(book.issn && { issn: book.issn })
        });

        // books/{bookId}/{slug}形式のURLに遷移
        router.push(`${bookUrl}?${searchParams.toString()}`);
    };

    /**
     * キャンセルボタンの処理（検索結果を非表示にする）
     */
    const handleCancel = () => {
        // 親コンポーネントに結果をクリアすることを通知
        // 現在は空の処理だが、将来的にpropsで関数を受け取って実装
        console.log("検索結果をキャンセル");
    };

    return (
        <div className="max-w-4xl p-4 border rounded-lg mx-auto mb-8">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-bold">
                        検索結果から選択してください
                    </h3>
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                        onClick={() => { }}
                    >
                        キャンセル
                    </button>
                </div>
                <div className="space-y-4">
                    {books.map((book, index) => {
                        const imageUrl = getSmallestImage(book.images);
                        return (
                            <div
                                key={book.isbn13 || book.isbn10 || book.issn || index}
                                className="flex gap-4 p-4 border rounded hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleBookClick(book)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleBookClick(book);
                                    }
                                }}
                            >
                                {imageUrl && (
                                    <Image
                                        src={imageUrl}
                                        alt={book.title}
                                        width={400}
                                        height={600}
                                        className="w-16 h-20 object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">{book.title}</h4>
                                    <p className="text-gray-600 mb-1">{book.authors.join(", ")}</p>
                                    <p className="text-sm text-gray-500">{book.publishedDate}</p>
                                    <div className="text-xs text-gray-400 mt-2">
                                        {book.isbn13 && <span>ISBN13: {book.isbn13}</span>}
                                        {book.isbn10 && !book.isbn13 && <span>ISBN10: {book.isbn10}</span>}
                                        {book.issn && !book.isbn13 && !book.isbn10 && <span>ISSN: {book.issn}</span>}
                                    </div>
                                </div>
                                {/* クリック可能であることを示すアイコン */}
                                <div className="flex items-center text-gray-400">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
