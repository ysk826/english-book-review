'use client'
import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import UserProfileEditModal from '@/components/UserProfileEditModal';
import SavedBooksList from '@/components/SavedBooksList';
import BookEditModal from '@/components/BookEditModal';
import { useProfile } from '@/hooks/useProfile';
import { useSavedBook } from '@/hooks/useSavedBook';
import { useBookEdit } from '@/hooks/useBookEdit';

export default function ProfilePage() {
    const {
        profile,
        isProfileEditModalOpen,
        openProfileEditModal,
        closeProfileEditModal,
        handleSaveUserProfile,
    } = useProfile();

    const { savedBooks, updateSavedBook } = useSavedBook();

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
                {profileWithCounts && (
                    <UserProfile
                        profile={profileWithCounts}
                        onEditProfile={openProfileEditModal}
                    />
                )}

                <UserProfileEditModal
                    isOpen={isProfileEditModalOpen}
                    profile={profile}
                    onClose={closeProfileEditModal}
                    onSave={handleSaveUserProfile}
                />

                <SavedBooksList savedBooks={savedBooks} onEditBook={openBookEditModal} />

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
