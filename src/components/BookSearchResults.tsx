"use client";
import { SearchResultBook } from "@/types/book";
import Image from "next/image";
import { BookImages } from "@/types/book";


/**
 * 検索結果表示コンポーネント
 */
export default function BookSearchResults({ books }: { books: SearchResultBook[] }) {

    const getSmallestImage = (images: BookImages): string | null => {
        return images?.smallThumbnail || images?.thumbnail || null;
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
                                onClick={() => { }}
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
                                    <h4 className="font-bold">{book.title}</h4>
                                    <p className="text-gray-600">{book.authors.join(", ")}</p>
                                    <p className="text-sm text-gray-500">{book.publishedDate}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
