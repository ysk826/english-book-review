import { test, expect, Page } from '@playwright/test'

/**
 * Supabase API と /api/books をネットワークレベルでモックするセットアップ
 * page.route() はリクエストを横取りし、実際のサーバーに届く前に偽レスポンスを返す
 */
async function setupMocks(page: Page) {
    // ① ログイン (supabase.auth.signInWithPassword → POST /auth/v1/token)
    await page.route('**/auth/v1/token**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                access_token: 'mock-access-token',
                token_type: 'bearer',
                expires_in: 3600,
                expires_at: Math.floor(Date.now() / 1000) + 3600,
                refresh_token: 'mock-refresh-token',
                user: {
                    id: 'mock-user-id',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: 'test@example.com',
                    created_at: '2024-01-01T00:00:00Z',
                },
            }),
        })
    })

    // ② セッション確認 (supabase.auth.getUser → GET /auth/v1/user)
    //    プロフィールページで複数回呼ばれる
    await page.route('**/auth/v1/user**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: 'mock-user-id',
                aud: 'authenticated',
                role: 'authenticated',
                email: 'test@example.com',
                created_at: '2024-01-01T00:00:00Z',
            }),
        })
    })

    // ③ プロフィール取得 (supabase.from('profiles').select → GET /rest/v1/profiles)
    await page.route('**/rest/v1/profiles**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{
                id: 'mock-profile-id',
                user_id: 'mock-user-id',
                name: 'テストユーザー',
                bio: null,
                avatar: null,
                read_count: 5,
                reading_count: 1,
                want_to_read_count: 3,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
            }]),
        })
    })

    // ④ 読書リスト取得 (supabase.from('user_books').select → GET /rest/v1/user_books)
    await page.route('**/rest/v1/user_books**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
        })
    })

    // ⑤ 書籍検索 API (GET /api/books)
    await page.route('**/api/books**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                items: [{
                    title: 'Clean Code',
                    authors: ['Robert Martin'],
                    publishedDate: '2008-08-01',
                    isbn13: '9780132350884',
                    isbn10: '0132350882',
                    issn: null,
                    images: { smallThumbnail: null, thumbnail: null },
                }],
                source: 'mock',
            }),
        })
    })
}

// ログインフォームを送信するヘルパー（各テストで再利用）
async function login(page: Page) {
    await page.goto('/login')
    await page.getByLabel('メールアドレス').fill('test@example.com')
    await page.getByLabel('パスワード').fill('password123')
    await page.getByRole('button', { name: 'ログイン' }).click()
    await expect(page).toHaveURL('/profile')
}

test.describe('書籍追加フロー', () => {
    test.beforeEach(async ({ page }) => {
        await setupMocks(page)
    })

    test('ログインページが正しく表示される', async ({ page }) => {
        await page.goto('/login')

        await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
        await expect(page.getByLabel('メールアドレス')).toBeVisible()
        await expect(page.getByLabel('パスワード')).toBeVisible()
        await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible()
    })

    test('ログインするとプロフィールページに遷移する', async ({ page }) => {
        await login(page)

        await expect(page).toHaveURL('/profile')
    })

    test('書籍を検索すると結果が表示される', async ({ page }) => {
        await login(page)

        await page.getByLabel('タイトル').fill('Clean Code')
        await page.getByRole('button', { name: '検索' }).click()

        await expect(page.getByText('Clean Code')).toBeVisible()
        await expect(page.getByText('Robert Martin')).toBeVisible()
    })

    test('検索結果から書籍を選択すると詳細ページに遷移する', async ({ page }) => {
        await login(page)

        await page.getByLabel('タイトル').fill('Clean Code')
        await page.getByRole('button', { name: '検索' }).click()
        await expect(page.getByText('Clean Code')).toBeVisible()

        // 検索結果の書籍カードをクリック
        await page.getByRole('button', { name: /Clean Code/ }).click()

        await expect(page).toHaveURL(/\/books\/9780132350884\/clean-code/)
    })
})
