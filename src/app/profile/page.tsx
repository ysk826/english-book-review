'use client'
import UserProfile from '@/components/UserProfile';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react';
import { Profile } from '@/types/database';
export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editName, setEditName] = useState('')
    const [editBio, setEditBio] = useState('')
    const [saving, setSaving] = useState(false)

    const supabase = createClientComponentClient()

    useEffect(() => {
        async function getProfile() {

            try {
                // ユーザー情報を取得
                const { data: { user } } = await supabase.auth.getUser()

                // ユーザーが存在しない場合は何もしない
                if (!user) return

                setUser(user)

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (error) {
                    return
                }
                setProfile(data)
            } catch (error) {
                console.error('エラー:', error)
            } finally {
                setLoading(false)
            }
        }

        getProfile()
    }, [supabase])

    const openEditModal = () => {
        if (profile) {
            setEditName(profile.name)
            setEditBio(profile.bio || '')
            setIsEditModalOpen(true)
        }
    }

    const handleSave = async () => {
        if (!profile || !user) return

        setSaving(true)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    name: editName,
                    bio: editBio || null,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id)
                .select()
                .single()

            if (error) {
                console.error('更新エラー:', error)
                return
            }

            setProfile(data)
            setIsEditModalOpen(false)
        } catch (error) {
            console.error('エラー:', error)
        } finally {
            setSaving(false)
        }
    }
    return (
        <div className="p-8">
            {/* ユーザープロフィール */}
            {profile && <UserProfile
                profile={profile} onEditProfile={openEditModal} />}
        </div>
    );
}