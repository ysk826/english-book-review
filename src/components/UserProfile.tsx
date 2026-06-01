import Image from "next/image"
import { userProfileProps } from "@/types/props"

/**
 * ユーザープロフィールコンポーネント
 * @param profile - ユーザープロフィールデータ
 * @param onEditProfile - プロフィール編集時のコールバック関数
 */
export default function UserProfile({ profile, onEditProfile, readThisYearCount }: userProfileProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            {/* 左: プロフィールカード */}
            <div className="flex-1 bg-white rounded-lg p-6">
                {/* プロフィール表示 */}
                <div className="text-center mb-6">
                    {/* アバター */}
                    {profile?.avatar ? (
                        <Image
                            src={profile.avatar}
                            alt={profile.name}
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-gray-600 text-2xl">
                                {profile?.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* 名前 + 編集ボタン */}
                    <div className="flex justify-center mb-2">
                        <div className="relative">
                            <h2 className="text-2xl font-bold text-gray-800 truncate max-w-[260px]">
                                {profile?.name}
                            </h2>
                            <button
                                onClick={() => onEditProfile(profile)}
                                title="プロフィールを編集"
                                className="absolute left-full top-1/2 -translate-y-1/2 ml-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* 自己紹介 */}
                    <p className="text-gray-600 mb-4 line-clamp-3 break-words">
                        {profile?.bio || '自己紹介がまだ設定されていません'}
                    </p>
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                    <div>
                        <div className="text-2xl font-bold text-blue-600">{profile?.read_count}</div>
                        <div className="text-sm text-gray-600">読んだ本</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">{profile?.reading_count}</div>
                        <div className="text-sm text-gray-600">読書中</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-orange-600">{profile?.want_to_read_count}</div>
                        <div className="text-sm text-gray-600">読みたい本</div>
                    </div>
                </div>
            </div>

            {/* 右: 読書統計カード */}
            <div className="bg-white rounded-lg p-6 md:w-48 flex flex-col justify-end gap-6">
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{readThisYearCount}</div>
                    <div className="text-sm text-gray-600 mt-1">今年読んだ本</div>
                </div>
            </div>
        </div>
    )
}