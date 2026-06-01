import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleBooksResponse, GoogleBooksItem } from '@/types/googleBooks';
import { Book } from '@/types/database';
import { formatApiBooks, formatDbBooks, extractValue } from './utils';

const PAGE_SIZE = 20;

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

    const startIndex = parseInt(searchParams.get("startIndex") || "0", 10);
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const fields = "items(id,volumeInfo(title,authors,imageLinks,publishedDate,language,industryIdentifiers))";

    try {
        // 2ページ目以降: Supabase をスキップして Google Books のみ取得
        if (startIndex > 0) {
            const res = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${PAGE_SIZE}&fields=${fields}&key=${apiKey}`
            );
            if (!res.ok) throw new Error("API error");
            const data: GoogleBooksResponse = await res.json();
            const rawCount = data.items?.length ?? 0;
            return NextResponse.json({
                items: formatApiBooks({ ...data, items: data.items || [] }),
                hasMore: rawCount >= PAGE_SIZE,
            });
        }

        // 1ページ目: Supabase + Google Books ハイブリッド検索
        const title = extractValue(query, "intitle");
        const author = extractValue(query, "inauthor");

        let dbBooks: Book[] = [];

        // ケース1: 両方入力あり → AND検索
        if (title && author) {
            const { data, error } = await supabase.from('books').select('*')
                .ilike('title', `%${title}%`)
                .ilike('authors', `%${author}%`);
            if (error) throw error;
            dbBooks = data || [];
        }
        // ケース2: タイトルのみ
        else if (title) {
            const { data, error } = await supabase.from('books').select('*')
                .ilike('title', `%${title}%`);
            if (error) throw error;
            dbBooks = data || [];
        }
        // ケース3: 著者のみ
        else if (author) {
            const { data, error } = await supabase.from('books').select('*')
                .ilike('authors', `%${author}%`);
            if (error) throw error;
            dbBooks = data || [];
        }
        // ケース4: プレーンクエリ（ヘッダー検索）→ タイトルのみDB検索
        // authorsはtext[]型のためilike不可。著者検索はGoogle Books APIに委ねる
        else {
            const { data, error: e1 } = await supabase.from('books').select('*').ilike('title', `%${query}%`);
            if (e1) throw e1;
            dbBooks = data || [];
        }

        // Google Books API呼び出し
        const isPlainQuery = !title && !author;

        let apiData: GoogleBooksResponse;
        let rawApiCount = 0;

        if (isPlainQuery) {
            // "J.K." "J.R.R." のようなイニシャルを含むクエリのみ著者名検索と判定。
            // それ以外はタイトル検索として扱い、inauthor: は呼ばない
            // （例: "Harry Potter" → inauthor:Potter が Beatrix Potter を返してしまうため）。
            const isAuthorQuery = /\b[A-Z]\.\s*[A-Z]?\.?\s/.test(query);
            const lastName = query.trim().split(/\s+/).pop() ?? query;

            const plainRes = fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`"${query}"`)}&maxResults=20&fields=${fields}&key=${apiKey}`);
            const titleRes = fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`intitle:"${query}"`)}&maxResults=40&fields=${fields}&key=${apiKey}`);
            const authorRes = isAuthorQuery
                ? fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`inauthor:${lastName}`)}&maxResults=40&startIndex=40&fields=${fields}&key=${apiKey}`)
                : null;

            const [plainResponse, titleResponse, authorResponse] = await Promise.all([plainRes, titleRes, authorRes]);
            if (!plainResponse.ok || !titleResponse.ok || (authorResponse && !authorResponse.ok)) {
                console.error("APIリクエスト失敗:", plainResponse.status, titleResponse.status, authorResponse?.status);
                throw new Error("API error");
            }
            const [plainData, titleData, authorData]: GoogleBooksResponse[] = await Promise.all([
                plainResponse.json(),
                titleResponse.json(),
                authorResponse ? authorResponse.json() : Promise.resolve({ items: [] }),
            ]);

            const allItems = isAuthorQuery
                ? [...(authorData.items || []), ...(plainData.items || []), ...(titleData.items || [])]
                : [...(titleData.items || []), ...(plainData.items || [])];
            rawApiCount = allItems.length;
            const seenIsbns = new Set<string>();
            const mergedItems = allItems.filter(item => {
                const isbn = item.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier
                    ?? item.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier;
                if (!isbn) return true;
                if (seenIsbns.has(isbn)) return false;
                seenIsbns.add(isbn);
                return true;
            });
            apiData = { ...plainData, items: mergedItems };
        } else {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40&fields=${fields}&key=${apiKey}`
            );
            if (!response.ok) {
                console.error("APIリクエスト失敗:", response.status, response.statusText);
                throw new Error("API error");
            }
            apiData = await response.json();
            rawApiCount = apiData.items?.length ?? 0;
        }

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
                return !(dbIsbnSet.has(apiIsbn13 ?? null) || dbIsbnSet.has(apiIsbn10 ?? null) || dbIsbnSet.has(apiIssn ?? null));
            }) || []
        };

        // 結果をマージして返す
        return NextResponse.json({
            items: [...formatDbBooks(dbBooks || []), ...(formatApiBooks(filteredApiData) || [])],
            hasMore: rawApiCount >= PAGE_SIZE,
            source: 'supabase_hybrid'
        });

    } catch (error) {
        console.error("検索エラー:", error);
        return NextResponse.json({ error: "検索に失敗しました" }, { status: 500 });
    }
}
