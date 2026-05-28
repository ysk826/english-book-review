"use client"
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Profile } from "@/types/database";
import { UserProfileEditModalProps } from "@/types/props"
import { supabase } from "@/lib/supabase";

export default function UserProfileEditModal({ isOpen, profile, onClose, onSave }: UserProfileEditModalProps) {
    const [editingName, setEditingName] = useState(profile ? profile.name : "");
    const [edittingBio, setEditingBio] = useState(profile?.bio ?? "");
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar ?? null);

    useEffect(() => {
        if (profile) {
            setEditingName(profile.name);
            setEditingBio(profile.bio ?? "");
            setAvatarUrl(profile.avatar ?? null);
        }
    }, [profile]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen || !profile) return null;

    // canvas APIで画像を正方形にトリミングして400×400にリサイズする
    const resizeImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
                const size = Math.min(img.width, img.height);
                const offsetX = (img.width - size) / 2;
                const offsetY = (img.height - size) / 2;

                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 400;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('canvas取得失敗'));

                ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 400, 400);
                canvas.toBlob(
                    (blob) => blob ? resolve(blob) : reject(new Error('Blob変換失敗')),
                    'image/jpeg',
                    0.85
                );
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const resized = await resizeImage(file);
            const path = `${user.id}/avatar.jpg`;
            const { error } = await supabase.storage
                .from('avatars')
                .upload(path, resized, { upsert: true, contentType: 'image/jpeg' });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(path);

            // キャッシュを無効化するためにタイムスタンプを付与
            setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
        } catch (err) {
            console.error('アップロードエラー:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveClick = () => {
        const updatedProfile: Profile = {
            ...profile,
            name: editingName,
            bio: edittingBio,
            avatar: avatarUrl,
        };
        onSave(updatedProfile);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ヘッダー */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">プロフィール編集</h3>
                </div>

                {/* アバター */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={profile.name}
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xl font-bold">
                                    {profile.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="absolute bottom-0 right-0 bg-gray-400 hover:bg-gray-500 text-white rounded-full p-1 transition-colors disabled:opacity-50"
                        >
                            {uploading ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                </svg>
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                    <p className="text-sm text-gray-500">{profile.name}</p>
                </div>

                {/* フォーム */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">名前</label>
                        <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            placeholder="名前を入力"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">自己紹介</label>
                        <textarea
                            value={edittingBio}
                            onChange={(e) => setEditingBio(e.target.value)}
                            placeholder="自己紹介を入力してください..."
                            className="w-full p-2 border rounded h-24 resize-none"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSaveClick}
                            disabled={uploading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}