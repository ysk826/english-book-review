import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserBookRecord } from '@/types/database';
import { UseSavedBookReturn } from '@/types/hooks';

/**
 * 読んだ本のリストを管理するカスタムフック
 * @usedBy src/app/profile/page.tsx
 */
export const useSavedBook = (): UseSavedBookReturn => {
    const [savedBooks, setSavedBooks] = useState<UserBookRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // JSONをパースする関数
    const parseBookData = (record: UserBookRecord): UserBookRecord => {
        if (!record.books) {
            return {
                ...record,
                books: null
            };
        }

        return {
            ...record,
            books: {
                ...record.books,
                authors: typeof record.books.authors === 'string'
                    ? JSON.parse(record.books.authors)
                    : record.books.authors,
                thumbnail: typeof record.books.thumbnail === 'string'
                    ? JSON.parse(record.books.thumbnail)
                    : record.books.thumbnail
            }
        };
    };

    // 読んだ本のリストを取得する関数
    // この関数は再生成されないようにuseCallbackでラップ
    const fetchSavedBooks = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Supabaseから現在のユーザー情報を取得
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                throw new Error("ユーザーがログインしていません");
            }

            // ユーザーIDを使用して、読んだ本のリストを取得
            const { data: savedBooksData, error: booksError } = await supabase
                .from('user_books')
                .select(`
                    user_id,
                    book_id,
                    status,
                    rating,
                    review,
                    started_reading_at,
                    finished_reading_at,
                    books (
                        id,
                        title,
                        authors,
                        thumbnail,
                        published_date,
                        isbn10,
                        isbn13,
                        issn
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (booksError || !savedBooksData) {
                throw new Error(booksError?.message ?? 'データの取得に失敗しました');
            }
            // 取得したデータをパースして状態に設定
            const parsedBooks = (savedBooksData as unknown as UserBookRecord[]).map(parseBookData);
            setSavedBooks(parsedBooks);
        } catch (error) {
            console.error("読んだ本の取得エラー:", error);
            setError(error instanceof Error ? error.message : "不明なエラーが発生しました");
        }
        finally {
            setLoading(false);
        }
    }, []);

    // コールバック関数: 更新された本の情報を親コンポーネントに通知する
    // この関数は、useBookEditフックから呼び出される
    const updateSavedBook = useCallback((updatedBook: UserBookRecord) => {

        // 更新された本の情報を状態に反映
        setSavedBooks(prevBooks =>
            prevBooks.map(book =>
                book.book_id === updatedBook.book_id
                    ? updatedBook
                    : book
            )
        );
    }, []);


    // 初回レンダリング時にデータを取得
    useEffect(() => {
        fetchSavedBooks();
    }, [fetchSavedBooks]);

    return {
        savedBooks,
        loading,
        error,
        updateSavedBook,
        fetchSavedBooks,
        refreshSavedBooks: fetchSavedBooks // リフレッシュ用のエイリアス

    }
}