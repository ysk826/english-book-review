'use client'
import UserProfile from '@/components/UserProfile';
import UserProfileEditModal from '@/components/UserProfileEditModal';
import { useProfile } from '@/hooks/useProfile';
import { Profile } from '@/types/database';

export default function ProfilePage() {

    // useProfileフックを使用して、現在のユーザープロフィールと編集モーダルの状態を取得
    const { profile, isEditModalOpen, openEditModal, closeEditModal, handleSaveUserProfile } = useProfile();

    // プロフィール編集時のコールバック関数
    const handleEditProfile = (_profile: Profile) => {
        openEditModal();
    }

    return (
        <div className="p-8">
            {/* ユーザープロフィール */}
            {profile && <UserProfile
                profile={profile} onEditProfile={handleEditProfile} />}

            {/* ユーザープロフィール編集モーダル */}
            {isEditModalOpen && profile && (
                <UserProfileEditModal
                    profile={profile}
                    onClose={closeEditModal}
                    onSave={handleSaveUserProfile}

                />
            )}
        </div>
    );
}