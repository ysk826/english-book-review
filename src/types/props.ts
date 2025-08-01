import { Profile } from '@/types/database'
export interface userProfileProps {
    /** ユーザープロフィールコンポーネントのプロパティ */
    profile: Profile;
    /** プロフィール編集時のコールバック関数 */
    onEditProfile: (profile: Profile) => void;
}

export interface UserProfileEditModalProps {
    profile: Profile;
    onClose: () => void;
}