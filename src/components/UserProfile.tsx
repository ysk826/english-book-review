import Image from "next/image"
import { userProfileProps } from "@/types/props"

/**
 * ユーザープロフィールコンポーネント
 * @param profile - ユーザープロフィールデータ
 * @param onEditProfile - プロフィール編集時のコールバック関数
 */
export default function UserProfile({ profile, onEditProfile }: userProfileProps) {
    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
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
                <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800 truncate max-w-[260px]">
                        {profile?.name}
                    </h2>
                    <button
                        onClick={() => onEditProfile(profile)}
                        title="プロフィールを編集"
                        className="text-slate-400 hover:text-blue-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
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
    )
}