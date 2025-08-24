import { useState } from "react";
import { SearchResultBook } from "@/types/book";
import { useBookSearchReturn } from "@/types/hooks";
import axios from 'axios';

/**
 * 書籍検索を管理するカスタムフック
 * @usedBy src/app/books/search/page.tsx
 */
export const useBookSearch = (): useBookSearchReturn => {
    // 検索条件を管理するステート
    const [titleQuery, setTitleQuery] = useState("");
    const [authorQuery, setAuthorQuery] = useState("");

    // 検索結果を管理するステート
    const [searchResults, setSearchResults] = useState<SearchResultBook[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    // 検索結果を親コンポーネントに通知する関数
    const handleSearchBook = async () => {

        // タイトルまたは著者が入力されていない場合はアラートを表示
        if (!titleQuery.trim() && !authorQuery.trim()) {
            alert("タイトルまたは著者を入力してください");
            return;
        }

        setLoading(true);
        try {
            let query = "";
            // タイトルと著者の両方が入力されている場合は、両方を含むクエリを作成
            if (titleQuery.trim() && authorQuery.trim()) {
                query = `intitle:"${titleQuery}" inauthor:"${authorQuery}"`;
            } else if (titleQuery.trim()) {
                query = `intitle:"${titleQuery}"`;
            } else if (authorQuery.trim()) {
                query = `inauthor:"${authorQuery}"`;
            }

            // APIリクエストを送信
            // '/api/books/route.tsのGETを使用している
            const { data } = await axios.get(`/api/books?q=${encodeURIComponent(query)}`);

            // エラーハンドリング
            if (!data.items || data.items.length === 0) {
                alert("検索結果が見つかりませんでした");
                return;
            }

            // 検索結果をステートに保存
            // このsetで親に渡されるsearchResultsが更新される
            setSearchResults(data.items);
            setShowResults(true);
        } catch (error) {
            console.error("エラー:", error);
            alert("本の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    }

    return {
        titleQuery,
        setTitleQuery,
        authorQuery,
        setAuthorQuery,
        searchResults,
        setSearchResults,
        showResults,
        loading,
        handleSearchBook
    };
}