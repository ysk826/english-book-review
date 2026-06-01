-- ============================================================
-- Row Level Security (RLS) ポリシー設定
-- Supabase Dashboard の SQL Editor で実行してください。
-- ============================================================

-- ------------------------------------------------------------
-- 1. RLS の有効化
-- ------------------------------------------------------------
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books      ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 2. user_books ポリシー
--    自分の読書記録のみ参照・操作可能
-- ============================================================
CREATE POLICY "user_books_select_own"
  ON public.user_books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_books_insert_own"
  ON public.user_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_books_update_own"
  ON public.user_books FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_books_delete_own"
  ON public.user_books FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================
-- 3. profiles ポリシー
--    自分のプロフィールのみ参照・操作可能
--    Phase 2 で他ユーザーのレビューを表示する際は
--    SELECT ポリシーを USING (true) に変更すること
-- ============================================================
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 4. books ポリシー
--    書籍マスタは公開 SELECT、認証ユーザーのみ INSERT 可能
--    UPDATE / DELETE は service role 経由のみ（ポリシーなし = 禁止）
--
--    注意: /api/books ルートは createClientComponentClient() を
--    サーバーサイドで使用するため auth コンテキストがない。
--    books の SELECT を公開にしないと書籍検索が壊れる。
-- ============================================================
CREATE POLICY "books_select_public"
  ON public.books FOR SELECT
  USING (true);

CREATE POLICY "books_insert_authenticated"
  ON public.books FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
