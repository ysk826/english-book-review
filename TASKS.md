# TASKS.md

このファイルは実装タスクの管理表です。
新しいタスクは ToDo に追加し、完了したものは Done に移動させてください。
現在進行中のタスクは In Progress に入れます。

---

## ToDo（実装予定）

### Phase 1

- [x] ログアウト機能を実装する（プロフィールページにボタンを追加）
- [ ] パスワードリセット画面を実装する（`/reset-password`）

### Task 重

- [x] `middleware.ts` を実装してルート保護を追加する（未ログインで `/profile` 等に直接アクセスできる）
- [x] 新規登録ページのデザインをモダンに統一する（インラインスタイルをTailwind CSSに置き換え）
- [x] `alert()` をトースト通知に置き換える（`register/page.tsx:67`）
- [x] 書籍詳細ページのデザインを変更する（`books/[id]/[slug]/page.tsx`）
- [x] Supabase RLS（Row Level Security）ポリシーを確認・設定する（`user_books` テーブルで他人のデータへのアクセスを防ぐ）
- [x] 書籍詳細ページの `next/head` を `generateMetadata` に移行する（`books/[id]/[slug]/page.tsx`、App Router では `next/head` が無視されSEOが機能していない）
- [x] ライブラリから本を削除できる機能を追加する（誤登録の取り消しができない）
- [ ] 書籍詳細ページのライブラリ追加フォームを改善する（すでにライブラリにある本でも「マイライブラリに追加」が表示される。ページ表示時に user_books を確認し、未登録なら追加フォーム・登録済みなら現在の値で初期化した編集フォームを表示する）
- [x] 書籍詳細ページの右カラムに自分のレビューを表示する（現状は何も表示されていない。user_books を取得してステータス・星評価・感想テキストを表示。未登録なら「まだ感想がありません」を表示）
- [x] 書籍詳細ページの左サイドバーのフォームを「感想を書く」ボタンに置き換える（BookAddForm を除去し、ボタンクリックで感想入力画面へ遷移）
- [x] 感想入力ページを実装する（`/books/[id]/[slug]/review`、星評価とテキスト入力、保存後は詳細ページに戻る）

### Task 中

- [x] `closeEditModal()` バグを修正する（`useProfile.ts:75`、正しくは `closeProfileEditModal()`）
- [ ] 検索結果のキャンセルボタンを実装する（`BookSearchResults.tsx`、`onClick` が空関数）
- [x] プロフィールのページで読んだ本のサムネイルが表示されない
- [x] 読んだ本がプロフィールページでカウントされていない
- [x] ステータス表示を日本語化する（`SavedBooksList.tsx`、`read` / `reading` / `want_to_read` がそのまま表示されていた）
- [ ] ローディング中の表示を追加する（`useProfile` / `useSavedBook` の `loading` が UI に反映されていない）
- [x] プロフィールのアバター画像を変更できるようにする（現状はイニシャルのプレースホルダーのみ。画像アップロード or URL 入力で `profiles.avatar` に保存）
- [ ] 書籍編集・保存時のトースト通知を追加する（`useBookEdit` に成功・失敗のフィードバックがない）
- [ ] `profiles` テーブルの `read_count` / `reading_count` / `want_to_read_count` 列を削除する（更新ロジックがなく常に初期値のままの死んだ列）
- [ ] 書籍一覧にステータスフィルタ・ソート機能を追加する（本が増えると一覧が無秩序になる）
- [ ] プロフィールの読書リストにページネーションを追加する（現状は全件取得のため登録数が増えると遅くなる。無限スクロールではなく「次へ」ボタン方式が管理用途に適切）

- [x] ヘッダーをログイン後の画面に追加する（`/profile`・`/books/[id]/[slug]`、ユーザー名とログアウトボタンを集約）
- [x] 書籍検索をヘッダーに移動する（StoryGraph参考。ユーザー名の左に検索テキストボックスを配置。タイトル・著者の両方に対応。検索結果の書影一覧をヘッダー直下にドロップダウン表示する）
- [ ] ヘッダーのユーザープロフィールリンクをアイコン表示に変更する（現状はテキストリンク。アバター画像またはユーザーアイコンをクリックで `/profile` へ遷移）

### Task 低

- [x] `<html lang="en">` を `"ja"` に修正する（`layout.tsx`、SEO・アクセシビリティに影響）
- [x] `metadata` をデフォルトから修正する（`layout.tsx`、title が "Create Next App" のまま）
- [x] デバッグ用コードを削除する（`profile/page.tsx` の `testFetchBooks` 関数とボタン）
- [ ] プロフィールページのデザインを改善する（`/profile`、全体的なレイアウト・見た目をモダンに統一する）
- [ ] UserProfile.tsのページとプロフィール編集モーダルのページをモダンに統一する
- [x] 書籍詳細ページのクエリパラメータ渡し設計を見直す（UUID + DBフェッチに移行、DB登録済み書籍はクリーンなURLに）
- [x] `published_date` が null の書籍をクリックすると詳細ページが表示されない（UUID経由はDBから取得するため解消）
- [ ] `useProfile` の未使用変数 `_loading` を整理する（`useProfile.ts:13`）
- [ ] `SavedBooksList` の空状態にCTAを追加する（「まだ本が登録されていません」だけでは次のアクションが不明）

### Phase 2

- [ ] 書籍ページで他ユーザーのレビューを閲覧できる機能を追加する（SPEC.md SHOULD）

### テスト整備

- [x] `api/books/route.ts` の `formatApiBooks` / `formatDbBooks` / `extractValue` のユニットテストを書く
- [x] `BookSearchForm` コンポーネントのテストを書く（入力・ボタン押下）
- [x] `BookSearchResults` コンポーネントのテストを書く（一覧表示・クリック遷移）
- [x] `BookAddForm` コンポーネントのテストを書く（フォームフィールド・送信）
- [x] `useBookDetail` フックのテストを書く（URL パラメータから BookDetailInfo を構築）
- [x] `useBookSearch` フックのテストを書く（axios モックで検索ロジックを確認）
- [x] E2E テスト: ログイン → 書籍検索 → 登録フローを書く
- [ ] `useBookLibrary` フックのテストを書く（本の追加・エラーハンドリング）
- [ ] `BookEditModal` コンポーネントのテストを書く（編集・保存・キャンセル）

---

## In Progress（作業中）

- [ ] （ここに現在作業中のタスクを書く）

---

## Done（完了）

- [x] 書籍詳細ページのデザインを変更する（左サイドバーに書影＋フォーム、右メインにタイトル・著者・あらすじの 2 カラムレイアウト）
- [x] `middleware.ts` を実装してルート保護を追加する（未ログインで `/profile` 等に直接アクセスできる）
- [x] プロフィールのアバター画像を変更できるようにする（canvas APIで400×400にリサイズ・圧縮してSupabase Storageにアップロード）
- [x] ログアウト機能を実装する（プロフィールページにボタンを追加）
- [x] 読んだ本がプロフィールページでカウントされていない
- [x] ヘッダーをログイン後の画面に追加する（`/profile`・`/books/[id]/[slug]`、ユーザー名とログアウトボタンを集約）
- [x] ログイン画面が質素なので、もう少し今風なデザインにする
- [x] 新規登録ページのデザインをモダンに統一する（インラインスタイルをTailwind CSSに置き換え）
- [x] `<html lang="en">` を `"ja"` に修正する（`layout.tsx`、SEO・アクセシビリティに影響）
- [x] `metadata` をデフォルトから修正する（`layout.tsx`、title が "Create Next App" のまま）
- [x] デバッグ用コードを削除する（`profile/page.tsx` の `testFetchBooks` 関数とボタン）
- [x] `closeEditModal()` バグを修正する（`useProfile.ts:75`、正しくは `closeProfileEditModal()`）
- [x] Supabase RLS（Row Level Security）ポリシーを確認・設定する（`user_books` / `profiles` / `books` テーブル。`supabase/rls.sql` を Dashboard で実行）
- [x] 書籍詳細ページの `next/head` を `generateMetadata` に移行する（`page.tsx` を Server Component 化し `book-detail-content.tsx` を分離。スラグから title を復元）
- [x] ライブラリから本を削除できる機能を追加する（Review ページの一番左に削除ボタン、確認モーダル経由で `user_books` を削除）

---

## 規模拡大時に対応（今は不要）

- [ ] ヘッダーのプロフィール取得を React Context に移行する（現状はページ遷移のたびに Supabase へクエリが走る。同時接続数が60を超える規模になったら対応）

---

## メモ

- タスクを着手する前に、必ず Claude Code に Planning モードで方針を出してもらうこと。
- 1タスクあたりの実装時間が長くなりそうな場合は、さらに細かく分割すること。
- 完了時には、必ずテストと Lint をパスさせてから Done に移動させること。
- 仕様の変更が発生した場合は、TASKS.md ではなく SPEC.md を先に更新すること。
