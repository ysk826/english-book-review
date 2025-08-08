
/**
 * 書籍の画像情報を表すインターフェース
 */
export interface BookImages {
    smallThumbnail: string | null;
    thumbnail: string | null;
}

/**
 * 検索結果の書籍情報を表すインターフェース
 */
export interface SearchResultBook {
    isbn10: string | null;
    isbn13: string | null;
    issn: string | null;
    title: string;
    authors: string[];
    images: BookImages;
    publishedDate: string;
}

export interface BookDetailInfo {
    id: string;
    title: string;
    authors: string[];
    publishedDate: string;
    isbn10: string | null;
    isbn13: string | null;
    issn: string | null;
    images: BookImages | null;
    description: string | null;
    pageCount: number | null;
    publisher: string | null;
}