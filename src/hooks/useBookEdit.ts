
import { useState } from "react";
import { UserBookRecord } from "@/types/database";
import { supabase } from '@/lib/supabase';
import { UseBookEditReturn } from "@/types/hooks";
import { toast } from 'sonner';

/**
 * 本の編集機能を提供するカスタムフック
 * @usedBy src/app/profile/page.tsx
 * @param onBookUpdated 本の更新後に呼び出されるコールバック関数
 */
export const useBookEdit = (onBookUpdated?: (updatedBook: UserBookRecord) => void): UseBookEditReturn => {
    // 編集中の本の情報を管理
    const [editingBook, setEditingBook] = useState<UserBookRecord | null>(null);
    const [_loading, setLoading] = useState(true)

    // モーダルの表示状態を管理
    const [isBookEditModalOpen, setIsBookEditModalOpen] = useState(false);

    // 本の編集を開始する関数: 本の情報を持たせてモーダルを開く
    const openBookEditModal = (book: UserBookRecord) => {
        setEditingBook(book);
        setIsBookEditModalOpen(true);
    }

    // 本の編集モーダルを閉じる関数
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
                toast.error('保存に失敗しました');
                return;
            }

            const updatedRecord = {
                ...editingBook,
                ...updatedData,
            };
            setEditingBook(updatedRecord);
            onBookUpdated?.(updatedRecord);
            toast.success('保存しました');
        } catch (error) {
            console.error('エラー:', error);
            toast.error('保存に失敗しました');
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