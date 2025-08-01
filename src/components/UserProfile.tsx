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
                {/* アバター（プレースホルダー） */}
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-600 text-2xl">
                        {profile?.name.charAt(0).toUpperCase()}
                    </span>
                </div>

                {/* 名前 */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {profile?.name}
                </h2>

                {/* 自己紹介 */}
                <p className="text-gray-600 mb-4">
                    {profile?.bio || '自己紹介がまだ設定されていません'}
                </p>

                {/* 編集ボタン */}
                <button
                    onClick={() => onEditProfile(profile)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                    プロフィールを編集
                </button>
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