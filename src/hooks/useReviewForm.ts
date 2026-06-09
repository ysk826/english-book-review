import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { UserBook } from '@/types/database';
import { BookDetailInfo } from '@/types/book';
import { generateBookUrl } from '@/utils/slugify';
import { toast } from 'sonner';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * 感想入力ページのフォーム状態と保存ロジックを管理するフック
 * @usedBy books/[id]/[slug]/review/page.tsx
 */
const todayStr = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const useReviewForm = (bookInfo: BookDetailInfo | null, existingEntry: UserBook | null) => {
    const router = useRouter();
    const [status, setStatus] = useState<string>(existingEntry?.status ?? 'read');
    const [rating, setRating] = useState<number>(existingEntry?.rating ?? 0);
    const [review, setReview] = useState<string>(existingEntry?.review ?? '');
    const [finishedAt, setFinishedAt] = useState<string>(
        existingEntry?.finished_reading_at
            ? existingEntry.finished_reading_at.split('T')[0]
            : todayStr()
    );
    const [saving, setSaving] = useState(false);

    const save = useCallback(async () => {
        if (!bookInfo) return;
        setSaving(true);
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                toast.error('ログインが必要です');
                router.push('/login');
                return;
            }

            // DB 未登録の書籍（ISBN ベース）の場合は books テーブルへ先に登録
            let bookId = bookInfo.id;
            if (!UUID_REGEX.test(bookId)) {
                // ISBNではなくタイトルで既存書籍を検索する。
                // ISBNは版ごとに異なるため厳密に使うと同一書籍が複数レコードに分散する。
                // 洋書アプリとして「タイトルが同じ＝同じ本」と扱い、DBに登録済みであれば再利用する。
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

            // T12:00:00.000Z（UTC正午）で保存。UTC深夜だとタイムゾーンによっては日付が前後にズレるため
            const finishedReadingAt = status === 'read'
                ? `${finishedAt}T12:00:00.000Z`
                : null;

            const { error: upsertError } = await supabase
                .from('user_books')
                .upsert({
                    user_id: user.id,
                    book_id: bookId,
                    status,
                    rating: rating || null,
                    review: review.trim() || null,
                    finished_reading_at: finishedReadingAt,
                }, { onConflict: 'user_id,book_id' });

            if (upsertError) throw upsertError;

            toast.success('感想を保存しました');
            router.push(generateBookUrl(bookId, bookInfo.title));
        } catch (error) {
            console.error(error);
            toast.error('保存に失敗しました');
        } finally {
            setSaving(false);
        }
    }, [bookInfo, router, status, rating, review, finishedAt, existingEntry]);

    const deleteEntry = useCallback(async () => {
        if (!existingEntry) return;
        setSaving(true);
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) return;

            const { error } = await supabase
                .from('user_books')
                .delete()
                .eq('user_id', user.id)
                .eq('book_id', existingEntry.book_id);

            if (error) throw error;
            toast.success('ライブラリから削除しました');
            router.push('/profile');
        } catch (error) {
            console.error(error);
            toast.error('削除に失敗しました');
        } finally {
            setSaving(false);
        }
    }, [existingEntry, router]);

    return { status, rating, review, finishedAt, saving, setStatus, setRating, setReview, setFinishedAt, save, deleteEntry };
};
