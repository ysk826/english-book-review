import { useState, useEffect } from 'react';
import { Profile } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { UseProfileReturn } from '@/types/hooks';

/**
 * ユーザープロフィールを管理するカスタムフック
 * @usedBy src/app/profile/page.tsx
 */
export const useProfile = (): UseProfileReturn => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true)

    // モーダルの表示状態を管理
    const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

    // プロフィール編集モーダルを開く関数
    const openProfileEditModal = () => {
        setIsProfileEditModalOpen(true);
    }

    // プロフィール編集モーダルを閉じる関数
    const closeProfileEditModal = () => setIsProfileEditModalOpen(false)

    // ユーザー情報をsupabaseから取得
    const fetchProfile = async () => {
        try {
            // ユーザー情報を取得
            const { data: { user } } = await supabase.auth.getUser()

            // ユーザーが存在しない場合は何もしない
            if (!user) return

            // プロフィール情報を取得
            // user_idが現在のユーザーIDと一致するプロフィールを取得
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
            // todo: ローディング状態を使用してユーザにロード中を表示する
            setLoading(false)
        }
    }

    // プロフィールを保存する関数
    const handleSaveUserProfile = async (updatedProfile: Profile) => {
        if (!profile) return;

        if (!updatedProfile.name.trim()) {
            throw new Error('名前を入力してください');
        }

        // プロフィール情報を更新
        const { error } = await supabase
            .from('profiles')
            .update({
                name: updatedProfile.name,
                bio: updatedProfile.bio,
                avatar: updatedProfile.avatar,
            })
            .eq('user_id', updatedProfile.user_id)

        if (error) {
            console.error('エラー:', error)
            return;
        }
        // 更新成功時にプロフィールを更新
        setProfile(updatedProfile)
        closeProfileEditModal();
        // ヘッダーのアバター・名前を最新化するよう通知
        window.dispatchEvent(new Event('profile-updated'));
    }

    // コンポーネントがマウントされた時にプロフィールをフェッチ
    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        fetchProfile,
        profile,
        loading,
        isProfileEditModalOpen,
        openProfileEditModal,
        closeProfileEditModal,
        handleSaveUserProfile,
    }
}