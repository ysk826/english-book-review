'use client'
import UserProfile from '@/components/UserProfile';
import UserProfileEditModal from '@/components/UserProfileEditModal';
import BookSearchForm from '@/components/BookSearchForm';
import BookSearchResults from '@/components/BookSearchResults';
import SavedBooksList from '@/components/SavedBooksList';
import BookEditModal from '@/components/BookEditModal';
import { useProfile } from '@/hooks/useProfile';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useSavedBook } from '@/hooks/useSavedBook';
import { useBookEdit } from '@/hooks/useBookEdit';
export default function ProfilePage() {

    // useProfileフックを使用して、現在のユーザープロフィールと編集モーダルの状態を取得
    const {
        profile,
        isProfileEditModalOpen,
        openProfileEditModal,
        closeProfileEditModal,
        handleSaveUserProfile,
        handleLogout,
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

    // useSavedBookフックを使用して、読んだ本のリストを取得
    const { savedBooks, updateSavedBook } = useSavedBook();

    // useBookEditフックを使用して、本の編集機能を取得
    const {
        editingBook,
        isBookEditModalOpen,
        openBookEditModal,
        closeBookEditModal,
        handleSaveBook,
    } = useBookEdit(updateSavedBook);

    return (

        <div className="p-8">
            {/* ユーザープロフィール */}
            {profile && <UserProfile
                profile={profile}
                onEditProfile={openProfileEditModal}
                onLogout={handleLogout}
            />}

            {/* ユーザープロフィール編集モーダル */}
            <UserProfileEditModal
                isOpen={isProfileEditModalOpen}
                profile={profile}
                onClose={closeProfileEditModal}
                onSave={handleSaveUserProfile}
            />


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

            {/* 読んだ本のリスト */}
            <SavedBooksList savedBooks={savedBooks} onEditBook={openBookEditModal} />

            {/* 読んだ本の編集モーダル */}
            <BookEditModal
                isOpen={isBookEditModalOpen}
                book={editingBook}
                onClose={closeBookEditModal}
                onSave={handleSaveBook}
            />
        </div>
    );
}