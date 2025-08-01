import { Profile } from "./database";

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
    isEditModalOpen: boolean;
    /** プロフィール編集モーダルを開く関数 */
    openEditModal: () => void;
    /** プロフィール編集モーダルを閉じる関数 */
    closeEditModal: () => void;
    /** 編集内容を保存する関数 */
    handleSaveUserProfile: (updatedProfile: Profile) => void;
};
