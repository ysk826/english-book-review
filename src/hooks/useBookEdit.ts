
import { useState } from "react";
import { UserBookRecord } from "@/types/database";
import { supabase } from '@/lib/supabase';



export const useBookEdit = (onBookUpdated?: (updatedBook: UserBookRecord) => void) => {
    const [editingBook, setEditingBook] = useState<UserBookRecord | null>(null);
    const [_loading, setLoading] = useState(true)


    // モーダルの表示状態を管理
    const [isBookEditModalOpen, setIsBookEditModalOpen] = useState(false);


    // 本の編集を開始する関数: 本の情報を持たせてモーダルを開く
    const openBookEditModal = (book: UserBookRecord) => {
        setEditingBook(book);
        setIsBookEditModalOpen(true);
    }

    const closeBookEditModal = () => setIsBookEditModalOpen(false)


    // 本の編集を保存する関数
    const handleSaveBook = async (updatedData: UserBookRecord) => {
        if (!editingBook) return;

        try {
            // ユーザー情報を取得
            const { data: { user } } = await supabase.auth.getUser()

            // ユーザーが存在しない場合は何もしない
            if (!user) return

            // Supabaseを使用して本の情報を更新
            const { error } = await supabase
                .from('user_books')
                .update({
                    status: updatedData.status,
                    rating: updatedData.rating,
                    review: updatedData.review,
                    started_reading_at: updatedData.started_reading_at,
                    finished_reading_at: updatedData.finished_reading_at,
                })
                .eq('book_id', editingBook.book_id)
                .eq('user_id', user.id);

            if (error) {
                console.error('エラー:', error);
                return;
            }

            // ローカルステートを更新
            const updatedRecord = {
                ...editingBook,  // 既存のデータを保持
                ...updatedData,   // 更新したフィールドを上書き
            };
            setEditingBook(updatedRecord);

            // コールバック関数で親に通知
            onBookUpdated?.(updatedRecord);
        } catch (error) {
            console.error('エラー:', error);
        } finally {
            // 編集モードを終了
            setLoading(false);
            closeBookEditModal();
        }
    }

    return {
        editingBook,
        isBookEditModalOpen,
        openBookEditModal,
        closeBookEditModal,
        setEditingBook,
        handleSaveBook,
    }
}