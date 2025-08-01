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