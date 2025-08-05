'use client'
import UserProfile from '@/components/UserProfile';
import UserProfileEditModal from '@/components/UserProfileEditModal';
import BookSearchForm from '@/components/BookSearchForm';
import BookSearchResults from '@/components/BookSearchResults';
import { useProfile } from '@/hooks/useProfile';
import { useBookSearch } from '@/hooks/useBookSearch';
import { Profile } from '@/types/database';

export default function ProfilePage() {

    // useProfileフックを使用して、現在のユーザープロフィールと編集モーダルの状態を取得
    const {
        profile,
        isEditModalOpen,
        openEditModal,
        closeEditModal,
        handleSaveUserProfile
    } = useProfile();

    // useBookSearchフックを使用して、検索機能を取得
    const {
        titleQuery,
        setTitleQuery,
        authorQuery,
        setAuthorQuery,
        searchResults,
        loading,
        handleSearchBook
    } = useBookSearch();

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

            {/* 読んだ本を追加するフォーム */}
            <BookSearchForm
                titleQuery={titleQuery}
                setTitleQuery={setTitleQuery}
                authorQuery={authorQuery}
                setAuthorQuery={setAuthorQuery}
                loading={loading}
                handleSearchBook={handleSearchBook}
            />
            {searchResults.length > 0 && <BookSearchResults books={searchResults} />}
        </div>
    );
}