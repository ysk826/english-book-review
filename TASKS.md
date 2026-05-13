# TASKS.md

このファイルは実装タスクの管理表です。
新しいタスクは ToDo に追加し、完了したものは Done に移動させてください。
現在進行中のタスクは In Progress に入れます。

---

## ToDo（実装予定）

### Phase 1

- [ ] ログアウト機能を実装する（プロフィールページにボタンを追加）
- [ ] パスワードリセット画面を実装する（`/reset-password`）

### Task 重

- [ ] `middleware.ts` を実装してルート保護を追加する（未ログインで `/profile` 等に直接アクセスできる）
- [x] 新規登録ページのデザインをモダンに統一する（インラインスタイルをTailwind CSSに置き換え）
- [ ] `alert()` をトースト通知に置き換える（`register/page.tsx:67`）

### Task 中

- [x] `closeEditModal()` バグを修正する（`useProfile.ts:75`、正しくは `closeProfileEditModal()`）
- [ ] 検索結果のキャンセルボタンを実装する（`BookSearchResults.tsx`、`onClick` が空関数）
- [ ] プロフィールのページで読んだ本のサムネイルが表示されない

### Task 低

- [x] `<html lang="en">` を `"ja"` に修正する（`layout.tsx`、SEO・アクセシビリティに影響）
- [x] `metadata` をデフォルトから修正する（`layout.tsx`、title が "Create Next App" のまま）
- [x] デバッグ用コードを削除する（`profile/page.tsx` の `testFetchBooks` 関数とボタン）
- [ ] UserProfile.tsのページとプロフィール編集モーダルのページをモダンに統一する

### テスト整備

- [x] `api/books/route.ts` の `formatApiBooks` / `formatDbBooks` / `extractValue` のユニットテストを書く
- [x] `BookSearchForm` コンポーネントのテストを書く（入力・ボタン押下）
- [x] `BookSearchResults` コンポーネントのテストを書く（一覧表示・クリック遷移）
- [x] `BookAddForm` コンポーネントのテストを書く（フォームフィールド・送信）
- [x] `useBookDetail` フックのテストを書く（URL パラメータから BookDetailInfo を構築）
- [x] `useBookSearch` フックのテストを書く（axios モックで検索ロジックを確認）
- [x] E2E テスト: ログイン → 書籍検索 → 登録フローを書く

---

## In Progress（作業中）

- [ ] （ここに現在作業中のタスクを書く）

---

## Done（完了）

- [x] ログイン画面が質素なので、もう少し今風なデザインにする
- [x] 新規登録ページのデザインをモダンに統一する（インラインスタイルをTailwind CSSに置き換え）
- [x] `<html lang="en">` を `"ja"` に修正する（`layout.tsx`、SEO・アクセシビリティに影響）
- [x] `metadata` をデフォルトから修正する（`layout.tsx`、title が "Create Next App" のまま）
- [x] デバッグ用コードを削除する（`profile/page.tsx` の `testFetchBooks` 関数とボタン）
- [x] `closeEditModal()` バグを修正する（`useProfile.ts:75`、正しくは `closeProfileEditModal()`）

---

## メモ

- タスクを着手する前に、必ず Claude Code に Planning モードで方針を出してもらうこと。
- 1タスクあたりの実装時間が長くなりそうな場合は、さらに細かく分割すること。
- 完了時には、必ずテストと Lint をパスさせてから Done に移動させること。
- 仕様の変更が発生した場合は、TASKS.md ではなく SPEC.md を先に更新すること。
