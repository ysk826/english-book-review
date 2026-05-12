# TASKS.md

このファイルは実装タスクの管理表です。
新しいタスクは ToDo に追加し、完了したものは Done に移動させてください。
現在進行中のタスクは In Progress に入れます。

---

## ToDo（実装予定）

### Phase 1

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

---

## メモ

- タスクを着手する前に、必ず Claude Code に Planning モードで方針を出してもらうこと。
- 1タスクあたりの実装時間が長くなりそうな場合は、さらに細かく分割すること。
- 完了時には、必ずテストと Lint をパスさせてから Done に移動させること。
- 仕様の変更が発生した場合は、TASKS.md ではなく SPEC.md を先に更新すること。
