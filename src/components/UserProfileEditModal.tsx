"use client"
import Image from "next/image";
import { useState } from "react";
import { Profile } from "@/types/database";
import { UserProfileEditModalProps } from "@/types/props"

export default function UserProfileEditModal({ profile, onClose, onSave }: UserProfileEditModalProps) {
    const [editingName, setEditingName] = useState(profile.name);
    const [edittingBio, setEditingBio] = useState(profile.bio || "");

    // 保存ボタンがクリックされたときの処理
    const handleSaveClick = () => {
        const updatedProfile: Profile = {
            ...profile,
            name: editingName,
            bio: edittingBio
        };
        onSave(updatedProfile);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => { }}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ヘッダー */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">プロフィール編集</h3>
                    <button
                        onClick={() => { }}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                </div>

                {/* ユーザープロフィール情報 */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                        {profile.avatar ? (
                            <Image
                                src={profile.avatar}
                                alt={profile.name}
                                width={80}
                                height={80}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xl font-bold">
                                    {profile.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        {/* 将来的に画像アップロード機能を追加 */}
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{profile.name}</p>
                </div>

                {/* フォーム */}
                <div className="space-y-4">
                    {/* 名前入力 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            名前
                        </label>
                        <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            placeholder="名前を入力"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* 自己紹介入力 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            自己紹介
                        </label>
                        <textarea
                            value={edittingBio}
                            onChange={(e) => setEditingBio(e.target.value)}
                            placeholder="自己紹介を入力してください..."
                            className="w-full p-2 border rounded h-24 resize-none"
                        />
                    </div>

                    {/* ボタン */}
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSaveClick}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}