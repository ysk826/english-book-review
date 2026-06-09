const AUTH_ERROR_MAP: [string, string][] = [
    ['Invalid login credentials', 'メールアドレスまたはパスワードが正しくありません'],
    ['User already registered', 'このメールアドレスはすでに登録されています'],
    ['Email not confirmed', 'メールアドレスの確認が完了していません。受信ボックスをご確認ください'],
    ['Password should be at least 6 characters', 'パスワードは6文字以上で入力してください'],
    ['Unable to validate email address: invalid format', 'メールアドレスの形式が正しくありません'],
    ['Signup requires a valid password', '有効なパスワードを入力してください'],
    ['Token has expired or is invalid', 'リンクの有効期限が切れているか、無効です。もう一度やり直してください'],
    ['Auth session missing', 'このリンクは無効または期限切れです。再度メールを送信してください'],
    ['Email rate limit exceeded', 'メール送信数の上限に達しました。しばらく経ってからお試しください'],
    ['New password should be different from the old password', '新しいパスワードは現在のパスワードと異なるものを設定してください'],
];

export function mapAuthError(message: string): string {
    for (const [key, ja] of AUTH_ERROR_MAP) {
        if (message.includes(key)) return ja;
    }
    return '予期しないエラーが発生しました';
}
