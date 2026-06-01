import { GoogleBooksResponse, GoogleBooksItem } from '@/types/googleBooks';
import { SearchResultBook } from '@/types/book';
import { Book } from '@/types/database';

export const formatApiBooks = (apiItems: GoogleBooksResponse): SearchResultBook[] => {
    const filtered = apiItems.items!.filter((item: GoogleBooksItem) => {
        const lang = item.volumeInfo.language;
        return !lang || lang.startsWith("en");
    });

    return filtered.map((item: GoogleBooksItem) => ({
        dbId: null,
        isbn10: item.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier || null,
        isbn13: item.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier || null,
        issn: item.volumeInfo.industryIdentifiers?.find(id => id.type === "ISSN")?.identifier || null,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ["不明"],
        images: {
            smallThumbnail: item.volumeInfo.imageLinks?.smallThumbnail || null,
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        },
        publishedDate: item.volumeInfo.publishedDate || "不明",
    }));
};

export const formatDbBooks = (dbItems: Book[]): SearchResultBook[] => {
    return dbItems.map(item => ({
        dbId: item.id,
        isbn10: item.isbn10 || null,
        isbn13: item.isbn13 || null,
        issn: item.issn || null,
        title: item.title,
        authors: typeof item.authors === 'string'
            ? JSON.parse(item.authors)
            : (item.authors || ["不明"]),
        images: typeof item.thumbnail === 'string'
            ? JSON.parse(item.thumbnail)
            : (item.thumbnail || { smallThumbnail: null, thumbnail: null }),
        publishedDate: item.published_date || "不明",
    }));
};

export function extractValue(query: string, key: string): string | null {
    const regex = new RegExp(`${key}:"([^"]+)"`);
    const match = query.match(regex);
    return match ? match[1] : null;
}
