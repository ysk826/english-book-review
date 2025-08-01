import { useState, useEffect } from 'react';
import { Profile } from '@/types/database';
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase';
import { UseProfileReturn } from '@/types/hooks';

export const useProfile = (): UseProfileReturn => {
    // ユーザーのプロフィールを管理
    const [profile, setProfile] = useState<Profile | null>(null);
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // モーダルの表示状態を管理
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openEditModal = () => setIsEditModalOpen(true)
    const closeEditModal = () => setIsEditModalOpen(false)

    // ユーザー情報をsupabaseから取得
    const fetchProfile = async () => {
        try {
            // ユーザー情報を取得
            const { data: { user } } = await supabase.auth.getUser()

            // ユーザーが存在しない場合は何もしない
            if (!user) return

            setUser(user)

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (error) {
                return
            }
            setProfile(data)
        } catch (error) {
            console.error('エラー:', error)
        } finally {
            setLoading(false)
        }
    }

    // コンポーネントがマウントされた時にプロフィールをフェッチ
    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        fetchProfile,
        profile,
        isEditModalOpen,
        openEditModal,
        closeEditModal
    }
}