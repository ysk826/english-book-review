# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

詳細な仕様は @SPEC.md を参照してください。
現在のタスク進捗は @TASKS.md を参照してください。

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript
- **スタイリング**: Tailwind CSS 4
- **バックエンド**: Next.js API Routes (`src/app/api/`)
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth (`@supabase/auth-helpers-nextjs`)
- **テスト**: 未設定
- **Lint/Format**: ESLint (`eslint-config-next`)
- **パッケージマネージャー**: npm

## ディレクトリ構成

```
.
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/books/route.ts      # GET /api/books: Supabase + Google Books API ハイブリッド検索
│   │   ├── books/[id]/[slug]/      # 書籍詳細・読書記録登録ページ
│   │   ├── login/                  # ログインページ
│   │   ├── register/               # 新規登録ページ
│   │   ├── profile/                # プロフィール・書籍管理ページ（メイン画面）
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/                 # プレゼンテーショナルコンポーネント（ロジックなし）
│   ├── hooks/                      # カスタムフック（ビジネスロジック）
│   ├── lib/
│   │   └── supabase.ts             # Supabase クライアント（全体で共有）
│   ├── types/
│   │   ├── book.ts                 # 検索結果・書籍詳細の型
│   │   ├── database.ts             # Supabase テーブルの型
│   │   ├── googleBooks.ts          # Google Books API レスポンスの生の型
│   │   ├── hooks.ts                # 各カスタムフックの戻り値の型
│   │   └── props.ts                # コンポーネント props の型
│   └── utils/
│       └── slugify.ts              # タイトルから SEO URL スラグを生成
├── SPEC.md
├── TASKS.md
└── CLAUDE.md
```

## コーディングルール

### 全般

- 既存のコードスタイルに合わせること。新しいパターンを勝手に導入しない。
- 変更は最小限に。タスクに関係ないリファクタリングは行わない。
- コメントは「なぜ」を書く。「何を」は書かない（コードを読めばわかるため）。
- エラーハンドリングは境界（外部API・ユーザー入力）のみで行う。内部関数では過剰にtry-catchしない。

## 作業フロー

1. タスクを受け取ったら、まず @TASKS.md を確認して現状を把握する。
2. いきなり実装せず、まず Planning モードで方針を提示する。
3. ユーザーの承認後、実装を開始する。
4. 実装後は必ず `pnpm test` と `pnpm lint` を実行し、全てパスすることを確認する。
5. 作業が完了したら @TASKS.md の該当タスクを Done セクションに移動させる。

## Commands

```bash
npm run dev      # 開発サーバー起動 (Turbopack)
npm run build    # プロダクションビルド
npm run lint     # ESLint
```

テストは未設定。

## Architecture

### データフロー

書籍追加の全体フロー:

1. `/profile` — `BookSearchForm` でタイトル/著者を入力
2. `useBookSearch` が `/api/books?q=` を叩く
3. `/api/books` — Supabase (既存書籍) と Google Books API を並行検索し、ISBNで重複除去してマージして返す
4. `BookSearchResults` で選択 → `/books/[id]/[slug]?...` へ遷移（クエリパラメータで書籍情報を引き継ぐ）
5. `useBookDetail` がクエリパラメータを解析して `BookDetailInfo` を構築
6. `useBookLibrary.addBookToLibrary` が `books` テーブルに upsert → `user_books` テーブルに読書記録を保存 → `/profile` に戻る

### 書籍詳細ページのデータ取得方式

`/books/[id]/[slug]` ページは **Google Books API を再度叩かず**、検索結果画面からクエリパラメータで書籍情報を受け取る設計。`useBookDetail` はパラメータを読み取るだけで外部通信しない。`id` には ISBN13 > ISBN10 > ISSN > `'unknown'` の優先順位で識別子が入る。

### フック設計パターン

- ページはロジックを持たず、複数のカスタムフックを組み合わせるだけ
- 各フックは `src/types/hooks.ts` に戻り値の型が定義されている
- コンポーネントの props 型は `src/types/props.ts` に集約
- プレゼンテーショナルコンポーネントは `src/components/`、ロジックは `src/hooks/`

### Supabase テーブル

| テーブル     | 用途                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| `profiles`   | ユーザープロフィール (`user_id` で auth.users と紐付け)                       |
| `books`      | 書籍マスタ。`thumbnail` と `authors` は JSON 文字列で保存されている場合がある |
| `user_books` | ユーザーの読書記録。`(user_id, book_id)` の複合キーで upsert                  |

`supabase` クライアントは `src/lib/supabase.ts` で `createClientComponentClient()` として初期化済み。全コンポーネント・フックはここからインポートする。

### 型システム

- `src/types/book.ts` — Google Books API / 検索結果の型 (`SearchResultBook`, `BookDetailInfo`)
- `src/types/database.ts` — Supabase テーブルの型 (`Profile`, `Book`, `UserBook`, `UserBookRecord`)
- `src/types/googleBooks.ts` — Google Books API レスポンスの生の型

### 既知のバグ

- `src/hooks/useProfile.ts:75` — `closeEditModal()` を呼んでいるが未定義。`closeProfileEditModal()` が正しい
- `src/components/BookSearchResults.tsx` — キャンセルボタンの `onClick` が空関数で未実装。`useBookSearch` の `setSearchResults([])` を呼べばよい
