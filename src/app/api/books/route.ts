import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleBooksResponse, GoogleBooksItem } from '@/types/googleBooks';
import { SearchResultBook } from '@/types/book';
import { Book } from '@/types/database';

// APIの検索結果をフォーマットする関数
export const formatApiBooks = (apiItems: GoogleBooksResponse): SearchResultBook[] => {

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

// データベースの書籍情報をフォーマットする関数
export const formatDbBooks = (dbItems: Book[]): SearchResultBook[] => {
    return dbItems.map(item => ({
        isbn10: item.isbn10 || null,
        isbn13: item.isbn13 || null,
        issn: item.issn || null,
        title: item.title,
        authors: typeof item.authors === 'string'
            ? JSON.parse(item.authors)
            : (item.authors || ["不明"]),
        images: typeof item.thumbnail === 'string'
            ? JSON.parse(item.thumbnail)
            : (item.thumbnail || { smallThumbnail: null, thumbnail: null }),
        publishedDate: item.published_date || "不明",
    }));
};

// クエリから特定のキーの値を抽出するヘルパー関数
export function extractValue(query: string, key: string): string | null {
    const regex = new RegExp(`${key}:"([^"]+)"`);
    const match = query.match(regex);
    return match ? match[1] : null;
}

/**
 * 書籍検索APIエンドポイント
 * SupabaseとGoogle Books APIを組み合わせて書籍情報を取得
 * @route GET /api/books
 * @usedBy useBookSearch.ts
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
        // Supabaseクエリ構築
        let dbQuery = supabase.from('books').select('*');

        // クエリからタイトルと著者を抽出
        const title = extractValue(query, "intitle");
        const author = extractValue(query, "inauthor");

        // ケース1: 両方入力あり → AND検索
        if (title && author) {
            dbQuery = dbQuery
                .ilike('title', `%${title}%`)
                .ilike('authors', `%${author}%`);
        }
        // ケース2: タイトルのみ
        else if (title) {
            dbQuery = dbQuery.ilike('title', `%${title}%`);
        }
        // ケース3: 著者のみ
        else if (author) {
            dbQuery = dbQuery.ilike('authors', `%${author}%`);
        }
        // ケース4: プレーンクエリ（ヘッダー検索）→ タイトルまたは著者でOR検索
        else {
            dbQuery = dbQuery.or(`title.ilike.%${query}%,authors.ilike.%${query}%`);
        }

        // Supabaseでの検索処理
        const { data: dbBooks, error } = await dbQuery;

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

        // DBのISBNをセットに変換
        const dbIsbnSet = new Set(dbBooks?.map(book => book.isbn13 || book.isbn10 || book.issn).filter(Boolean));

        // APIから取得した本のうち、DBに存在しない本を抽出
        const filteredApiData = {
            // 1: apiDataの全プロパティをコピー
            ...apiData,

            items: apiData.items?.filter((apiItem: GoogleBooksItem) => {
                // 2: 各本に対して以下の処理
                // 各要素のvolumeInfoのindustryIdentifiersのtypeがISBN_13またはISBN_10のidentifierを取得
                const apiIsbn13 = apiItem.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier;
                const apiIsbn10 = apiItem.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier;
                const apiIssn = apiItem.volumeInfo.industryIdentifiers?.find(id => id.type === "ISSN")?.identifier;


                // DBに同じISBNの本が存在しないかチェック
                return !(dbIsbnSet.has(apiIsbn13) || dbIsbnSet.has(apiIsbn10) || dbIsbnSet.has(apiIssn));
            }) || []
        };

        // 結果をマージして返す
        return NextResponse.json({
            items: [...formatDbBooks(dbBooks || []), ...(formatApiBooks(filteredApiData) || [])],
            source: 'supabase_hybrid'
        });

    } catch (error) {
        console.error("検索エラー:", error);
        return NextResponse.json({ error: "検索に失敗しました" }, { status: 500 });
    }
}