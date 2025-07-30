import { Profile } from '@/types/database'
export interface userProfileProps {
    profile: Profile | null;
    onEditProfile: () => void;
}