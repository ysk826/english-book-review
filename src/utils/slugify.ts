/**
 * 本のタイトルからSEO対応のslugを生成する関数
 * @param title - 本のタイトル
 * @returns SEO対応のslug文字列
 * @example
 * generateBookSlug("The Great Gatsby") // "the-great-gatsby"
 * generateBookSlug("To Kill a Mockingbird!") // "to-kill-a-mockingbird"
 * generateBookSlug("1984: A Novel") // "1984-a-novel"
 */
export const generateBookSlug = (title: string): string => {
    if (!title) {
        return 'untitled';
    }

    return title
        .toLowerCase()                    // 小文字に変換
        .trim()                          // 前後の空白を削除
        .replace(/[^\w\s-]/g, '')        // 英数字、スペース、ハイフン以外を削除
        .replace(/\s+/g, '-')            // 1つ以上のスペースをハイフンに変換
        .replace(/-+/g, '-')             // 連続するハイフンを単一のハイフンに変換
        .replace(/^-+|-+$/g, '')         // 先頭と末尾のハイフンを削除
        .substring(0, 100);              // 最大100文字に制限（URL長制限対策）
};

/**
 * 本の情報から詳細ページのURLを生成する関数
 * @param bookId - 本の識別子（ISBN13 > ISBN10 > ISSN > 'unknown'の優先順位）
 * @param title - 本のタイトル
 * @returns 本の詳細ページのURL
 * @example
 * generateBookUrl("9781234567890", "The Great Gatsby")
 * // "/books/9781234567890/the-great-gatsby"
 */
export const generateBookUrl = (bookId: string, title: string): string => {
    const slug = generateBookSlug(title);
    return `/books/${bookId}/${slug}`;
};

/**
 * URLのslugとタイトルが一致するかチェックする関数
 * @param urlSlug - URLから取得したslug
 * @param actualTitle - 実際の本のタイトル
 * @returns slugが一致するかのboolean
 * @description
 * SEO URLの正当性チェックに使用
 * slugが一致しない場合はリダイレクトまたは404を返す判断材料となる
 */
export const isValidSlug = (urlSlug: string, actualTitle: string): boolean => {
    const expectedSlug = generateBookSlug(actualTitle);
    return urlSlug === expectedSlug;
};