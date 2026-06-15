# Stride Log App

洋書を読んだ記録をつけ、他のユーザーのレビューを参考に次に読む本を選べる、英語学習者向けの読書管理サービス。

> **デザイン参考**: [StoryGraph](https://app.thestorygraph.com/)

---

## 作った動機

英語の多読を続ける中で「読み終わった本をどこに記録するか」が定まらず、メモアプリや紙に散らばっていた。
自分が欲しいものを自分で作るのが一番続くと考え、Phase 1（記録）→ Phase 2（他者レビュー閲覧）の順で実装中。

---

## 技術スタック

| レイヤー  | 採用技術                                        | 選定理由                                                                                       |
| --------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Framework | Next.js 15 (App Router)                         | 書籍詳細ページのOG/SEOのためSSRが欲しく、ファイル単位でServer/Client分離できるApp Routerを採用 |
| UI        | React 19 + Tailwind CSS 4                       | デザインシステムの自作は過剰と判断。Tailwindでデザイントークンを集中管理                       |
| Backend   | Next.js API Routes + Supabase                   | 個人開発の運用コストを最小化。認証・DB・Storageを1サービスに集約                               |
| Auth      | Supabase Auth (`@supabase/auth-helpers-nextjs`) | middlewareでSSR時のセッション復元が必要だったため公式helperを採用                              |
| HTTP      | axios                                           | エラーハンドリングの記述量がfetchより少なく、外部API用途では割に合う                           |
| Test      | Vitest + React Testing Library + Playwright     | 単体・コンポーネント・E2Eで責務を分離                                                          |
| Toast     | sonner                                          | アクセシブルでAPIが最小。アラート置き換え用途には十分                                          |

---

## 実装の構成と工夫

### 1. ハイブリッド書籍検索（DB × Google Books API）

**[`src/app/api/books/route.ts`](src/app/api/books/route.ts)**

同じ本を何度も検索した際にGoogle Books APIを毎回叩くのは無駄なので、
DBの`books`テーブルとGoogle Books APIを**並行で**検索し、ISBNで重複除去してマージする方式に変更。

- **トレードオフ**: DB側はタイトル/著者の部分一致のみで、検索精度はGoogle Books APIに劣る
- **将来の改善**: `pg_trgm`による全文検索 or Postgresの`tsvector`を検討

### 2. ページとロジックの分離（カスタムフック設計）

**[`src/hooks/`](src/hooks/)** に11個のフックを配置

ページコンポーネントは「複数のカスタムフックを組み合わせるだけ」のルールを徹底。
各フックの戻り値の型は[`src/types/hooks.ts`](src/types/hooks.ts)に集約してインターフェースを安定化。

例: [`useBookDetail.ts`](src/hooks/useBookDetail.ts) はクエリパラメータからBookDetailInfoを構築するロジックを単独で持ち、ページからは値を読むだけ。

### 3. 書籍詳細ページの「APIを再度叩かない」設計

**[`src/app/books/[id]/[slug]/`](src/app/books/[id]/[slug]/)**

検索結果から詳細ページに遷移する際、クエリパラメータで書籍情報を引き継ぐことで、
**Google Books APIを1セッションで1回しか叩かない**設計に。
ISBN13 > ISBN10 > ISSN > `'unknown'`の優先順で識別子を決定し、URLスラグでSEOにも配慮。

### 4. Row Level Security（RLS）でアプリ層に頼らない認可

**[`supabase/rls.sql`](supabase/rls.sql)**

`user_books` / `profiles` / `books` テーブルすべてにRLSポリシーを設定。
アプリ層のバグでクエリが漏れてもDBで弾く多層防御の構成。

### 5. プロフィール画像の最適化

**[`src/components/UserProfileEditModal.tsx`](src/components/UserProfileEditModal.tsx)**

Canvas APIで400×400にリサイズ・圧縮してからSupabase Storageへアップロード。
原寸の画像をそのまま上げてStorageを圧迫しないため。

---

## アーキテクチャ

### データフロー（書籍追加）

```
[BookSearchForm]
  ↓ タイトル/著者入力
[useBookSearch] → GET /api/books?q=
  ↓
[/api/books] → Supabase + Google Books API を並行検索
  ↓ ISBN重複除去・マージ
[BookSearchResults] → 選択
  ↓ クエリパラメータで遷移
[/books/[id]/[slug]] → useBookDetail がパラメータ解析
  ↓ ユーザーが「感想を書く」
[/books/[id]/[slug]/review] → useBookLibrary.addBookToLibrary
  ↓
[books テーブル upsert] → [user_books テーブル upsert]
  ↓
[/profile に戻る]
```

### ER図

```
auth.users (Supabase管理)
    │
    ├──< profiles  (user_id)
    └──< user_books (user_id, book_id) >── books
```

| テーブル     | 役割                                             |
| ------------ | ------------------------------------------------ |
| `profiles`   | ユーザープロフィール                             |
| `books`      | 書籍マスタ。ISBN10/13/ISSNで識別                 |
| `user_books` | 読書記録。`(user_id, book_id)`の複合キーでupsert |

詳細は [SPEC.md](SPEC.md) を参照。

---

## 設計判断の記録

### 意図的に実装しなかったこと

- **`profiles.read_count`等の集計列を削除**: 更新ロジックがなく死んだ列になっていたため、都度集計に統一（[commit](#)）
- **無限スクロール**: 管理用途には「次へ」ボタン方式が適切と判断
- **SNSシェア / フォロー機能**: MVP範囲外。[SPEC.md](SPEC.md)のWON'Tに明記

### 設計を変更した記録

- **書籍詳細ページのURL設計**: 当初はクエリパラメータで全情報を渡していたが、`published_date`がnullの本でリンクが切れるバグが出たため、UUID + DBフェッチに移行
- **検索フォームの配置**: 当初はプロフィールページ内、その後StoryGraphを参考にヘッダーへ移動

すべての意思決定の履歴は[TASKS.md](TASKS.md)に残しています。

---

## テスト戦略

| 種別             | ファイル数 | 対象                                                 |
| ---------------- | ---------- | ---------------------------------------------------- |
| 単体（純粋関数） | 1          | `slugify`                                            |
| API Route        | 1          | `/api/books` のフォーマット関数                      |
| カスタムフック   | 2          | `useBookDetail`, `useBookSearch`                     |
| コンポーネント   | 3          | `BookSearchForm`, `BookSearchResults`, `BookAddForm` |
| E2E (Playwright) | 1          | ログイン→検索→登録の主要フロー                       |

```bash
npm run test       # Vitest watch
npm run test:run   # CI向け1回実行
npm run test:e2e   # Playwright
```

未整備領域は[TASKS.md](TASKS.md)の「テスト整備」セクションに記録しています。

---

## ローカル起動

### 必要環境

- Node.js 20+
- Supabaseプロジェクト（無料枠で可）

### セットアップ

```bash
# 1. リポジトリ取得
git clone <repo-url>
cd english-book-review
npm install

# 2. 環境変数設定
cp .env.local.example .env.local
# 以下をSupabaseダッシュボードからコピー
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Supabase スキーマ適用
# Dashboard の SQL Editor で以下を実行
#   - supabase/rls.sql（RLSポリシー）
#   - （別途、profiles / books / user_books テーブルの DDL を実行する必要があります）

# 4. 開発サーバー起動
npm run dev
```

→ http://localhost:3000

---

## 既知の課題と改善計画

完成品ではなく、現状認識と次の一手を明示する目的で記載しています。

### 現状認識

- **ヘッダーのプロフィール取得が毎ページ走る**: 同時接続数60超の規模になったらReact Contextに移行予定。今の規模では過剰最適化と判断
- **書籍一覧にフィルタ/ソートがない**: 登録数が増えると一覧が無秩序になる。ステータス別タブを次に実装
- **読書リストのページネーション未実装**: 全件取得のため登録数が増えると遅くなる

### Phase 2（次の開発フェーズ）

- 書籍詳細ページで他ユーザーのレビューを閲覧できる機能（SPEC.mdのSHOULD要件）

全タスクは[TASKS.md](TASKS.md)で管理しています。

---

## 開発プロセス

### ドキュメント駆動

- **[SPEC.md](SPEC.md)**: 「何を作るか」
- **[CLAUDE.md](CLAUDE.md)**: 「どう作るか」のルール、既知のバグ、アーキテクチャ
- **[TASKS.md](TASKS.md)**: ToDo / In Progress / Done のタスク管理

仕様変更が発生したらTASKS.mdではなくSPEC.mdから更新するルール。

### コミット規約

[Conventional Commits](https://www.conventionalcommits.org/)に準拠（`feat:` / `fix:` / `refactor:` / `docs:` / `style:` / `test:`）。
タイトルは日本語で「何を」「なぜ」が分かる粒度を保つ。

例: `fix: useSavedBookでbooksErrorがnullの場合の参照エラーを修正する`

### AI活用について

Claude Code をペアプロパートナーとして活用しています。

- 設計判断・スコープ決定・コードレビューは自分で行う
- 実装の補助とドキュメント整備の壁打ち相手として利用
- 思考プロセスはCLAUDE.md / TASKS.mdに記録し、後から追跡可能にしている

AI活用の事実を明示。**設計判断・スコープ決定・コードレビューは自分が担い、AIは実装補助と壁打ち相手として使う**、という分担で開発しています。

---

## ライセンス

個人開発・ポートフォリオ用途。商用利用不可。
