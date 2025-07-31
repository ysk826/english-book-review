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
};
