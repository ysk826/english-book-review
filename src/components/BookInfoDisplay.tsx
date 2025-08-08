import Image from "next/image";
import type { BookInfoDisplayProps } from "@/types/props";

/**
 * 本の基本情報を表示するコンポーネント
 * @usedBy books/[id]/[slug]/page.tsx
 * @description 本のタイトル、著者、出版日、ページ数、あらすじを表示
 * @param book - 表示する本の情報
 */
export default function BookInfoDisplay({ book }: BookInfoDisplayProps) {
    return (
        <div className="grid md:grid-cols-3 gap-8">
            {/* 本の画像 */}
            <div className="md:col-span-1">
                {book.images && (book.images.thumbnail || book.images.smallThumbnail) ? (
                    <Image
                        src={book.images.thumbnail || book.images.smallThumbnail || ""}
                        alt={book.title}
                        width={400}
                        height={600}
                        className="w-full max-w-sm mx-auto rounded-lg shadow-sm"
                    />
                ) : (
                    <div className="w-full max-w-sm mx-auto h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">画像なし</span>
                    </div>
                )}
            </div>

            {/* 本の情報 */}
            <div className="md:col-span-2">
                <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-2">
                    著者: {book.authors.join(", ")}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                    出版社: {book.publisher}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                    出版日: {book.publishedDate}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    ページ数: {book.pageCount}
                </p>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">あらすじ</h3>
                    <p className="text-gray-700 leading-relaxed">
                        {book.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
