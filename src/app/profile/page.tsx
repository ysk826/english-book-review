'use client'
import Header from '@/components/Header';
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

    // user_booksの実データからカウントを計算し、profilesテーブルの静的な値を上書き
    const profileWithCounts = profile ? {
        ...profile,
        read_count: savedBooks.filter(b => b.status === 'read').length,
        reading_count: savedBooks.filter(b => b.status === 'reading').length,
        want_to_read_count: savedBooks.filter(b => b.status === 'want_to_read').length,
    } : null;

    return (
        <div>
            <Header />
        <div className="p-8">
            {/* ユーザープロフィール */}
            {profileWithCounts && <UserProfile
                profile={profileWithCounts}
                onEditProfile={openProfileEditModal}
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
        </div>
    );
}