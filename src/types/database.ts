import { BookImages } from '@/types/book';

export interface Profile {
    id: string;
    user_id: string;
    name: string;
    avatar: string | null;
    bio: string | null;
    read_count: number;
    reading_count: number;
    want_to_read_count: number;
    created_at: string;
    updated_at: string;
}

export interface UserBook {
    id: string;
    user_id: string;
    book_id: string;
    status: 'want_to_read' | 'reading' | 'read';
    rating: number | null;
    review: string | null;
    started_reading_at: string | null;
    finished_reading_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Book {
    id: string;
    title: string;
    authors: string[];
    thumbnail: BookImages | null;
    published_date: string | null;
    isbn10: string | null;
    isbn13: string | null;
    issn: string | null;
    created_at: string;
    updated_at: string;
}

// ユーザーの読書記録を含む本の情報
export interface UserBookRecord {
    user_id: string;
    book_id: string;
    status: 'want_to_read' | 'reading' | 'read';
    rating: number | null;
    review: string | null;
    started_reading_at: string | null;
    finished_reading_at: string | null;
    books: {
        id: string;
        title: string;
        authors: string[];
        thumbnail: BookImages | null;
        published_date: string | null;
    } | null;
}