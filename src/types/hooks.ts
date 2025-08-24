import { Profile, UserBookRecord } from "./database";
import { SearchResultBook, BookDetailInfo } from "./book";

/**
 * useProfileの戻り値の型定義
 * @usedBy hooks/useProfile.tsx
 */
export type UseProfileReturn = {
    /** 現在ログイン中のユーザー情報。未ログイン時はnull */
    profile: Profile | null;
    /** プロフィールを取得する関数 */
    fetchProfile: () => Promise<void>;
    /** プロフィール編集モーダルの表示状態 */
    isProfileEditModalOpen: boolean;
    /** プロフィール編集モーダルを開く関数 */
    openProfileEditModal: (profile: Profile) => void;
    /** プロフィール編集モーダルを閉じる関数 */
    closeProfileEditModal: () => void;
    /** 編集内容を保存する関数 */
    handleSaveUserProfile: (updatedProfile: Profile) => void;
};

/**
 * useBookSearchフックの戻り値の型定義
 * @usedBy hooks/useBookSearch.tsx
 */
export type useBookSearchReturn = {
    /** 検索クエリのタイトル */
    titleQuery: string;
    /** タイトルクエリを設定する関数 */
    setTitleQuery: (value: string) => void;
    /** 検索クエリの著者名 */
    authorQuery: string;
    /** 著者クエリを設定する関数 */
    setAuthorQuery: (value: string) => void;
    /** 検索結果の本のリスト */
    searchResults: SearchResultBook[];
    /** 検索結果を設定する関数 */
    setSearchResults: (results: SearchResultBook[]) => void;
    /** 検索結果を表示するかどうか */
    showResults: boolean;
    /** ローディング状態 */
    loading: boolean;
    /** 本の検索を実行する関数 */
    handleSearchBook: () => Promise<void>;
}

/**
 * useBookDetailフックの戻り値の型定義
 * @usedBy hooks/useBookDetail.tsx
 */
export interface UseBookDetailReturn {
    bookInfo: BookDetailInfo | null;
    loading: boolean;
    displayImage: string | null;
}

export interface UseSavedBookReturn {
    savedBooks: UserBookRecord[];
    loading: boolean;
    error: string | null;
    fetchSavedBooks: () => Promise<void>;
    refreshSavedBooks: () => Promise<void>;
    updateSavedBook: (updatedRecord: UserBookRecord) => void;
}

/**
 * useBookEditフックの戻り値の型定義
 * @usedBy hooks/useBookEdit.tsx
 */
export interface UseBookEditReturn {
    /** 編集中の本の情報 */
    editingBook: UserBookRecord | null;
    /** モーダルの表示状態 */
    isBookEditModalOpen: boolean;
    /** 本の編集モーダルを開く関数 */
    openBookEditModal: (book: UserBookRecord) => void;
    /** 本の編集モーダルを閉じる関数 */
    closeBookEditModal: () => void;
    /** 編集中の本を設定する関数 */
    setEditingBook: (book: UserBookRecord | null) => void;
    /** 本の編集を保存する関数 */
    handleSaveBook: (updatedBook: UserBookRecord) => Promise<void>;
}