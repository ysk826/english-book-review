export type Profile = {
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

export type UserBook = {
    id: string;
    user_id: string;
    book_id: string;
    status: string | null;
    rating: number | null;
    review: string | null;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}