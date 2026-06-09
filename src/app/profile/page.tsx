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
        loading: profileLoading,
        isProfileEditModalOpen,
        openProfileEditModal,
        closeProfileEditModal,
        handleSaveUserProfile,
    } = useProfile();

    const { savedBooks, loading: booksLoading, updateSavedBook } = useSavedBook();

    const {
        editingBook,
        isBookEditModalOpen,
        openBookEditModal,
        closeBookEditModal,
        handleSaveBook,
    } = useBookEdit(updateSavedBook);

    // user_booksの実データからカウントを計算し、profilesテーブルの静的な値を上書き
    const currentYear = new Date().getFullYear();
    const readThisYearCount = savedBooks.filter(b =>
        b.status === 'read' &&
        b.finished_reading_at !== null &&
        new Date(b.finished_reading_at).getUTCFullYear() === currentYear
    ).length;

    const readCount = savedBooks.filter(b => b.status === 'read').length;
    const readingCount = savedBooks.filter(b => b.status === 'reading').length;
    const wantToReadCount = savedBooks.filter(b => b.status === 'want_to_read').length;

    return (
        <div>
            <Header />
            <div className="p-8">
                {profileLoading ? (
                    <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto animate-pulse">
                        <div className="flex-1 bg-white rounded-lg p-6">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                                <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-3" />
                                <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-40 mx-auto" />
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-t pt-4">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="text-center">
                                        <div className="h-8 bg-gray-200 rounded w-10 mx-auto mb-2" />
                                        <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 md:w-48 flex flex-col justify-end gap-6">
                            <div className="text-center">
                                <div className="h-10 bg-gray-200 rounded w-12 mx-auto mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-20 mx-auto" />
                            </div>
                        </div>
                    </div>
                ) : profile ? (
                    <UserProfile
                        profile={profile}
                        onEditProfile={openProfileEditModal}
                        readThisYearCount={readThisYearCount}
                        readCount={readCount}
                        readingCount={readingCount}
                        wantToReadCount={wantToReadCount}
                    />
                ) : null}

                <UserProfileEditModal
                    isOpen={isProfileEditModalOpen}
                    profile={profile}
                    onClose={closeProfileEditModal}
                    onSave={handleSaveUserProfile}
                />

                {booksLoading ? (
                    <div className="space-y-10 mt-10 animate-pulse">
                        {[0, 1].map(section => (
                            <div key={section}>
                                <div className="h-5 bg-gray-200 rounded w-24 mb-4" />
                                <div className="flex gap-4 overflow-hidden">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className="flex-shrink-0 w-24">
                                            <div className="w-24 h-36 bg-gray-200 rounded-lg mb-2" />
                                            <div className="h-3 bg-gray-200 rounded mb-1" />
                                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-10 mt-10">
                        {savedBooks.filter(b => b.status === 'read').length > 0 && (
                            <SavedBooksList
                                title="読んだ本"
                                savedBooks={savedBooks.filter(b => b.status === 'read')}
                                loading={false}
                                onEditBook={openBookEditModal}
                            />
                        )}
                        {savedBooks.filter(b => b.status === 'reading').length > 0 && (
                            <SavedBooksList
                                title="読んでいる本"
                                savedBooks={savedBooks.filter(b => b.status === 'reading')}
                                loading={false}
                                onEditBook={openBookEditModal}
                            />
                        )}
                        {savedBooks.filter(b => b.status === 'want_to_read').length > 0 && (
                            <SavedBooksList
                                title="読みたい本"
                                savedBooks={savedBooks.filter(b => b.status === 'want_to_read')}
                                loading={false}
                                onEditBook={openBookEditModal}
                            />
                        )}
                    </div>
                )}

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
