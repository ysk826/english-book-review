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
import { Profile } from '@/types/database';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {

    // useProfileフックを使用して、現在のユーザープロフィールと編集モーダルの状態を取得
    const {
        fetchProfile,
        profile,
        isProfileEditModalOpen,
        openProfileEditModal,
        closeProfileEditModal,
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

    // useSavedBookフックを使用して、読んだ本のリストを取得
    const { savedBooks, updateSavedBook, loading: booksLoading, fetchSavedBooks } = useSavedBook();

    // useBookEditフックを使用して、本の編集機能を取得
    const {
        editingBook,
        isBookEditModalOpen,
        openBookEditModal,
        closeBookEditModal,
        setEditingBook,
        handleSaveBook,
    } = useBookEdit(updateSavedBook);

    // テスト関数
    const testFetchBooks = async () => {
        console.log('=== テスト開始 ===');

        try {
            // ユーザー情報を確認
            const { data: userData, error: userError } = await supabase.auth.getUser();
            console.log('1. ユーザー情報:', userData);
            console.log('   ユーザーID:', userData?.user?.id);

            if (userError) {
                console.error('ユーザーエラー:', userError);
                return;
            }

            // まずはシンプルなクエリでテスト
            const { data: simpleData, error: simpleError } = await supabase
                .from('user_books')
                .select('*')
                .eq('user_id', userData.user.id);

            console.log('2. シンプルクエリ結果:', simpleData);
            console.log('   件数:', simpleData?.length);

            // JOIN付きのクエリでテスト
            const { data: joinData, error: joinError } = await supabase
                .from('user_books')
                .select(`
                    user_id,
                    book_id,
                    status,
                    rating,
                    review,
                    started_reading_at,
                    finished_reading_at,
                    books (
                        id,
                        title,
                        authors,
                        thumbnail,
                        published_date
                    )
                `)
                .eq('user_id', userData.user.id);

            console.log('3. JOIN付きクエリ結果:', joinData);
            console.log('   エラー:', joinError);

            console.log('=== テスト完了 ===');
            return joinData;

        } catch (error) {
            console.error('キャッチエラー:', error);
        }
    };


    return (

        <div className="p-8">
            {/* テスト用ボタン（開発時のみ表示） */}
            {process.env.NODE_ENV === 'development' && (
                <button
                    onClick={testFetchBooks}
                    className="bg-red-500 text-white p-2 rounded m-4"
                >
                    📚 DB接続テスト
                </button>
            )}
            {/* ユーザープロフィール */}
            {profile && <UserProfile
                profile={profile} onEditProfile={openProfileEditModal} />}

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