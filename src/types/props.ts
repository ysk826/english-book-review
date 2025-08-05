import { Profile } from '@/types/database'

export interface userProfileProps {
    /** ユーザープロフィールコンポーネントのプロパティ */
    profile: Profile;
    /** プロフィール編集時のコールバック関数 */
    onEditProfile: (profile: Profile) => void;
}

export interface UserProfileEditModalProps {
    /** ユーザープロフィール編集モーダルのプロパティ */
    profile: Profile;
    /** モーダルを閉じる関数 */
    onClose: () => void;
    /** 編集内容を保存する関数 */
    onSave: (updatedProfile: Profile) => void;
}

export interface BookSearchFormProps {
    /** 書籍検索フォームのプロパティ */
    titleQuery: string;
    /** タイトル検索クエリを更新する関数 */
    setTitleQuery: (value: string) => void;
    /** 著者検索クエリ */
    authorQuery: string;
    /** 著者検索クエリを更新する関数 */
    setAuthorQuery: (value: string) => void;
    /** ローディング状態 */
    loading: boolean;
    /** 本の検索を実行する関数 */
    handleSearchBook: () => Promise<void>;
}