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
                ) : savedBooks.length === 0 ? (
                    <div className="mt-16 text-center">
                        <div className="text-slate-300 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="currentColor" viewBox="0 0 256 256" className="mx-auto">
                                <path d="M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z" />
                            </svg>
                        </div>
                        <p className="text-slate-600 font-medium mb-1">まだ本が登録されていません</p>
                        <p className="text-sm text-slate-400">上の検索バーからタイトルや著者名で本を探してみましょう</p>
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
