import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserBook } from '@/types/database';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * 現在のユーザーのその本に対する user_books エントリを取得するフック
 * @usedBy books/[id]/[slug]/page.tsx
 */
export const useUserBookEntry = (bookId: string) => {
    const [userBook, setUserBook] = useState<UserBook | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookId || !UUID_REGEX.test(bookId)) {
            setLoading(false);
            return;
        }

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                setLoading(false);
                return;
            }
            supabase
                .from('user_books')
                .select('id, user_id, book_id, status, rating, review, started_reading_at, finished_reading_at, created_at, updated_at')
                .eq('book_id', bookId)
                .eq('user_id', user.id)
                .maybeSingle()
                .then(({ data }) => {
                    setUserBook(data);
                    setLoading(false);
                });
        });
    }, [bookId]);

    return { userBook, loading };
};
