'use client'
import UserProfile from '@/components/UserProfile';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {

    const { profile, fetchProfile } = useProfile();

    return (
        <div className="p-8">
            {/* ユーザープロフィール */}
            {profile && <UserProfile
                profile={profile} onEditProfile={() => { }} />}
        </div>
    );
}