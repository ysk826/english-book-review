'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Profile } from '@/types/database'
import { User } from '@supabase/supabase-js'

export default function UserProfile() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editName, setEditName] = useState('')
    const [editBio, setEditBio] = useState('')
    const [saving, setSaving] = useState(false)

    const supabase = createClientComponentClient()

    // プロフィール取得
    useEffect(() => {
        async function getProfile() {

            try {
                const { data: { user } } = await supabase.auth.getUser()
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

    // 編集モーダルを開く
    const openEditModal = () => {
        if (profile) {
            setEditName(profile.name)
            setEditBio(profile.bio || '')
            setIsEditModalOpen(true)
        }
    }

    // プロフィール更新
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

    if (loading) {
        return <div className="p-6 text-center">読み込み中...</div>
    }

    if (!profile) {
        return <div className="p-6 text-center">プロフィールが見つかりません</div>
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            {/* プロフィール表示 */}
            <div className="text-center mb-6">
                {/* アバター（プレースホルダー） */}
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-600 text-2xl">
                        {profile.name.charAt(0).toUpperCase()}
                    </span>
                </div>

                {/* 名前 */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {profile.name}
                </h2>

                {/* 自己紹介 */}
                <p className="text-gray-600 mb-4">
                    {profile.bio || '自己紹介がまだ設定されていません'}
                </p>

                {/* 編集ボタン */}
                <button
                    onClick={openEditModal}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                    プロフィールを編集
                </button>
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                <div>
                    <div className="text-2xl font-bold text-blue-600">{profile.read_count}</div>
                    <div className="text-sm text-gray-600">読んだ本</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-green-600">{profile.reading_count}</div>
                    <div className="text-sm text-gray-600">読書中</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-orange-600">{profile.want_to_read_count}</div>
                    <div className="text-sm text-gray-600">読みたい本</div>
                </div>
            </div>

            {/* 編集モーダル */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold mb-4">プロフィール編集</h3>

                        {/* 名前入力 */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                名前
                            </label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="名前を入力"
                            />
                        </div>

                        {/* 自己紹介入力 */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                自己紹介
                            </label>
                            <textarea
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="自己紹介を入力"
                            />
                        </div>

                        {/* ボタン */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                disabled={saving}
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !editName.trim()}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                            >
                                {saving ? '保存中...' : '保存'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}