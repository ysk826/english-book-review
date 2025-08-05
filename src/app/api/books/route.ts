import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleBooksResponse, GoogleBooksItem } from '@/types/googleBooks';
import { SearchResultBook } from '@/types/book';

// APIの検索結果をフォーマットする関数
const formatApiBooks = (apiItems: GoogleBooksResponse): SearchResultBook[] => {

    // 言語フィルタリング: 英語の本のみを対象
    const filtered = apiItems.items!.filter((item: GoogleBooksItem) => {
        const lang = item.volumeInfo.language;
        return lang === "en" || lang === "en-US" || lang === "en-GB";
    });

    // フォーマットされた書籍情報を返す
    return filtered.map((item: GoogleBooksItem) => ({
        isbn10: item.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier || null,
        isbn13: item.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier || null,
        issn: item.volumeInfo.industryIdentifiers?.find(id => id.type === "ISSN")?.identifier || null,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ["不明"],
        images: {
            smallThumbnail: item.volumeInfo.imageLinks?.smallThumbnail || null,
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        },
        publishedDate: item.volumeInfo.publishedDate || "不明",
    }));
};

/**
 * 書籍検索APIエンドポイント
 * SupabaseとGoogle Books APIを組み合わせて書籍情報を取得
 * @route GET /api/books
 * @usedBy BookSearchForm.tsx
 * @param {string} request.url - リクエストURLからクエリパラメータを取得
 * @returns {Promise<NextResponse>} - 検索結果をJSON形式で返す
 * @description DBとGoogle Books APIの結果を結合しJSON形式でフロントエンドに返す
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ error: "クエリが必要です" }, { status: 400 });
    }

    try {
        // Supabaseでの検索処理
        const { data: dbBooks, error } = await supabase
            .from('books')
            .select('*')
            .or(`title.ilike.%${query}%,authors.ilike.%${query}%`);

        if (error) {
            throw error;
        }

        // Google Books API呼び出し（既存コードと同様）
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
        const fields = "items(id,volumeInfo(title,authors,imageLinks,publishedDate,language,industryIdentifiers))";
        const maxResults = 40;

        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                query
            )}&langRestrict=en&maxResults=${maxResults}&fields=${fields}&key=${apiKey}`
        );

        // エラーハンドリング: レスポンスが成功でない場合はエラーを投げる
        if (!response.ok) {
            console.error("APIリクエスト失敗:", response.status, response.statusText);
            throw new Error("API error");
        }

        // レスポンスをJSON形式で取得
        const apiData: GoogleBooksResponse = await response.json();

        // 結果をマージして返す
        return NextResponse.json({
            items: [...(dbBooks || []), ...(formatApiBooks(apiData) || [])],
            source: 'supabase_hybrid'
        });

    } catch (error) {
        console.error("検索エラー:", error);
        return NextResponse.json({ error: "検索に失敗しました" }, { status: 500 });
    }
}