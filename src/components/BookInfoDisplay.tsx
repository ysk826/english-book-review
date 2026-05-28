import type { BookInfoDisplayProps } from "@/types/props";

export default function BookInfoDisplay({ book }: BookInfoDisplayProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-snug">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{book.authors.join(", ")}</p>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-400 mb-8">
                {book.publisher && <span>{book.publisher}</span>}
                {book.publisher && (book.publishedDate || book.pageCount) && <span>·</span>}
                {book.publishedDate && <span>{book.publishedDate}</span>}
                {book.publishedDate && book.pageCount && <span>·</span>}
                {book.pageCount && <span>{book.pageCount} pages</span>}
            </div>

            {book.description && (
                <div>
                    <h2 className="text-base font-semibold text-gray-800 mb-3">あらすじ</h2>
                    <p className="text-gray-600 leading-relaxed text-sm">{book.description}</p>
                </div>
            )}
        </div>
    );
}
