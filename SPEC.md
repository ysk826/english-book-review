# SPEC.md

このファイルはプロジェクトの仕様書です。「何を作るか」を定義します。
（「どう作るか」のルールは @CLAUDE.md を参照してください）

## プロダクト概要

### 名称

English Book Review App（洋書レビューアプリケーション）

### 目的

ユーザーが読んだ洋書をレビューして投稿できる。
ユーザーが他ユーザーのレビューを読める。
ユーザーがレビューを参考に次に読みたい本を決める。

### ターゲットユーザー

- 英語学習者
- 洋書を読む人

### 価値提案

- 学習コストゼロ。初見で使える。
- 自分のページでこれまでの読んだ本が見れる。

---

## 機能要件

### MUST（必須機能）

1. **ユーザー認証**
    - メールアドレス + パスワードでサインアップ / ログイン
    - パスワードリセット（メールでリセットリンクを送信）
    - ログアウト

2. **マイ読書リスト**
    - 読んだ本・読書中・読みたい本をステータスで管理
    - 評価（1〜5）とレビューテキストを記録
    - 一覧表示・編集

3. **書籍検索・登録**
    - タイトル / 著者でキーワード検索（Google Books API + DB ハイブリッド）
    - 検索結果から選んでライブラリに追加

### SHOULD（あると望ましい機能）

1. **他ユーザーのレビューを閲覧**
    - 書籍ページで他ユーザーの評価・レビューを読める
    - レビューを参考に次に読む本を決められる

### WON'T（今回は作らない機能）

- ユーザー間のフォロー・フィード機能
- レビューへのいいね・コメント
- SNS シェア

---

## 画面構成

| 画面名             | パス                    | 概要                                         |
| ------------------ | ----------------------- | -------------------------------------------- |
| ホーム             | `/`                     | 未ログイン時のトップ。ログインへ誘導          |
| ログイン           | `/login`                | メール・パスワードでログイン                 |
| 新規登録           | `/register`             | メール・パスワード・名前でアカウント作成     |
| パスワードリセット | `/reset-password`       | リセットメールを送信する画面（未実装）       |
| プロフィール       | `/profile`              | マイ読書リスト・書籍検索・プロフィール編集   |
| 書籍詳細           | `/books/[id]/[slug]`    | 書籍情報の確認とライブラリへの追加           |

---

## データモデル

> 認証ユーザーは Supabase が管理する `auth.users` テーブルで保持。アプリ側のテーブルは以下の3つ。

### profiles

| フィールド        | 型        | 説明                                        |
| ----------------- | --------- | ------------------------------------------- |
| id                | UUID      | 主キー                                      |
| user_id           | UUID      | `auth.users.id` への外部キー                |
| name              | text      | 表示名                                      |
| avatar            | text?     | アバター画像 URL                            |
| bio               | text?     | 自己紹介文                                  |
| read_count        | int       | 読了した本の冊数                            |
| reading_count     | int       | 読書中の本の冊数                            |
| want_to_read_count| int       | 読みたい本の冊数                            |
| created_at        | timestamp |                                             |
| updated_at        | timestamp |                                             |

### books

| フィールド    | 型        | 説明                                              |
| ------------- | --------- | ------------------------------------------------- |
| id            | UUID      | 主キー                                            |
| title         | text      | 書籍タイトル                                      |
| authors       | text[]    | 著者リスト（JSON 文字列として保存される場合あり） |
| thumbnail     | jsonb?    | `{ smallThumbnail, thumbnail }` の画像 URL        |
| published_date| text?     | 出版日                                            |
| isbn10        | text?     | ISBN-10                                           |
| isbn13        | text?     | ISBN-13                                           |
| issn          | text?     | ISSN                                              |
| created_at    | timestamp |                                                   |
| updated_at    | timestamp |                                                   |

### user_books

| フィールド          | 型        | 説明                                              |
| ------------------- | --------- | ------------------------------------------------- |
| id                  | UUID      | 主キー                                            |
| user_id             | UUID      | `auth.users.id` への外部キー                      |
| book_id             | UUID      | `books.id` への外部キー                           |
| status              | enum      | `want_to_read` / `reading` / `read`               |
| rating              | int?      | 評価（数値）                                      |
| review              | text?     | レビューテキスト                                  |
| started_reading_at  | timestamp?| 読書開始日時                                      |
| finished_reading_at | timestamp?| 読書終了日時                                      |
| created_at          | timestamp |                                                   |
| updated_at          | timestamp |                                                   |

## API エンドポイント

> **凡例**
> - **Custom Route** — `src/app/api/` に実装されたカスタム API Route
> - **Supabase SDK** — クライアントから Supabase SDK を直接呼び出し（`src/lib/supabase.ts`）

### 認証（Supabase SDK）

- `POST /api/auth/signup` — サインアップ（メール・パスワード・名前）→ `profiles` テーブルにも insert
- `POST /api/auth/login` — ログイン（メール・パスワード）
- `POST /api/auth/logout` — ログアウト

### 書籍（Custom Route）

- `GET /api/books?q={query}` — 書籍検索。Supabase の `books` テーブルと Google Books API をハイブリッド検索し、ISBN で重複除去してマージして返す

### プロフィール（Supabase SDK）

- `GET profiles` — ログイン中ユーザーのプロフィール取得
- `PATCH profiles` — プロフィール更新（name, bio）

### 読書記録（Supabase SDK）

- `GET user_books + books` — 読書リスト取得（`books` テーブルと JOIN）
- `POST books` — 書籍マスタ登録（DB に存在しない場合のみ）
- `UPSERT user_books` — 読書記録の追加・更新（status, rating, review）
- `PATCH user_books` — 読書記録の編集（status, rating, review, 開始日, 終了日）

## 非機能要件

- **パフォーマンス**: ダッシュボードの初期表示は2秒以内。
- **可用性**: 稼働率99.5%以上を目標。
- **セキュリティ**: パスワードはbcryptでハッシュ化。通信は全てHTTPS。
- **対応ブラウザ**: Chrome / Safari / Edge / Firefox の最新2バージョン。

---

## マイルストーン

### Phase 1 — MUST 機能の完成（現在）

- [x] ユーザー認証（サインアップ・ログイン）
- [x] 書籍検索・登録
- [x] マイ読書リスト（表示・編集）
- [ ] ログアウト
- [ ] パスワードリセット

### Phase 2 — SHOULD 機能

- [ ] 書籍ページで他ユーザーのレビューを閲覧
