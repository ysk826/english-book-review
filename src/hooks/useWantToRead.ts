import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BookDetailInfo } from '@/types/book';
import { toast } from 'sonner';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * 「読みたい本に追加」ロジックを管理するフック
 * @usedBy books/[id]/[slug]/page.tsx
 */
export const useWantToRead = (bookInfo: BookDetailInfo | null, refetch: () => void) => {
    const router = useRouter();
    const [adding, setAdding] = useState(false);

    const addToWantToRead = useCallback(async () => {
        if (!bookInfo) return;
        setAdding(true);
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                toast.error('ログインが必要です');
                router.push('/login');
                return;
            }

            let bookId = bookInfo.id;
            if (!UUID_REGEX.test(bookId)) {
                const { data: existing } = await supabase
                    .from('books')
                    .select('id')
                    .ilike('title', bookInfo.title)
                    .limit(1);

                if (existing?.[0]) {
                    bookId = existing[0].id;
                } else {
                    const { data: newBook, error } = await supabase
                        .from('books')
                        .insert({
                            title: bookInfo.title,
                            authors: bookInfo.authors,
                            thumbnail: bookInfo.images,
                            published_date: bookInfo.publishedDate,
                            isbn10: bookInfo.isbn10,
                            isbn13: bookInfo.isbn13,
                            issn: bookInfo.issn,
                        })
                        .select()
                        .single();
                    if (error) throw error;
                    bookId = newBook.id;
                }
            }

            const { error: upsertError } = await supabase
                .from('user_books')
                .upsert({
                    user_id: user.id,
                    book_id: bookId,
                    status: 'want_to_read',
                }, { onConflict: 'user_id,book_id' });

            if (upsertError) throw upsertError;

            toast.success('読みたい本に追加しました');
            refetch();
        } catch (error) {
            console.error(error);
            toast.error('追加に失敗しました');
        } finally {
            setAdding(false);
        }
    }, [bookInfo, router, refetch]);

    return { adding, addToWantToRead };
};
