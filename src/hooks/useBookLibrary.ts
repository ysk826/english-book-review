import { useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { BookDetailInfo } from "@/types/book";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';



/**
 * 本のライブラリ管理に関するカスタムフック
 * @usedBy books/[id]/[slug]/page.tsx
 * @param bookInfo 本の詳細情報
 * @returns
 */
export const useBookLibrary = (bookInfo: BookDetailInfo) => {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<string>("read");
    const [rating, setRating] = useState<number | null>(null);
    const [review, setReview] = useState<string>("");

    /**
     * 本をDBに追加する関数
     */
    const addBookToLibrary = useCallback(async () => {

        // ボタンが無効化： "追加中..."と表示
        setSaving(true);
        try {
            // 現在のユーザーを取得
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                toast.error('ログインが必要です');
                router.push('/login');
                return;
            }
            // 1. 本の存在確認（版に関わらずタイトルで同一書籍とみなす）
            const { data: existingBooks } = await supabase
                .from('books')
                .select('id')
                .ilike('title', bookInfo.title)
                .limit(1);
            let book = existingBooks?.[0] ?? null;

            // 2. 本が存在しない場合のみ作成
            if (!book) {
                // booksテーブルに保存
                // select: upsert後の最新データを取得
                // single: 追加したレコード1件を取得
                const { data: newBook, error: newBookError } = await supabase
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
                // エラーハンドリング
                if (newBookError) throw newBookError;
                book = newBook;
            }
            // 3. ユーザーの読書記録を保存(更新)
            const { data: _userBook, error: userBookError } = await supabase
                .from('user_books')
                .upsert({
                    user_id: user.id,
                    book_id: book!.id,
                    status: status,
                    rating: rating,
                    review: review,
                    started_reading_at: null, // todo: 必要に応じて設定
                    finished_reading_at: null, // todo: 必要に応じて設定
                }, { onConflict: 'user_id,book_id' })
                .select()
                .single();

            // エラーハンドリング
            if (userBookError) throw userBookError;

            toast.success('ライブラリに追加しました！');
            // 本の詳細ページに遷移
            router.push("/profile");
        }
        catch (error) {
            console.error("Error saving book to library:", error);
            const errorMessage = error instanceof Error ? error.message : "保存に失敗しました";
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    }, [bookInfo, router, status, rating, review]);

    return {
        saving,
        status,
        rating,
        review,
        setStatus,
        setRating,
        setReview,
        addBookToLibrary
    };
}