import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { isValidSlug } from '@/utils/slugify';
import { BookDetailInfo } from '@/types/book';
import { UseBookDetailReturn } from '@/types/hooks';

/**
 * 本の詳細情報を取得するカスタムフック
 * @usedBy books/[id]/[slug]/page.tsx
 * @returns BookDetailInfoとローディング状態、表示用の画像URLを返す
 */
export const useBookDetail = (): UseBookDetailReturn => {
    const params = useParams();
    const searchParams = useSearchParams();
    const [bookInfo, setBookInfo] = useState<BookDetailInfo | null>(null);
    const [loading, setLoading] = useState(true);

    // useEffectの外で値を取得（ESLint警告を回避）
    const bookId = params.id as string;
    const urlSlug = params.slug as string;
    const title = searchParams.get('title');
    const authors = searchParams.get('authors');
    const publishedDate = searchParams.get('publishedDate');
    const isbn10 = searchParams.get('isbn10');
    const isbn13 = searchParams.get('isbn13');
    const issn = searchParams.get('issn');
    const smallThumbnail = searchParams.get('smallThumbnail');
    const thumbnail = searchParams.get('thumbnail');

    useEffect(() => {

        // パラメータの存在チェック
        if (!params || !searchParams) {
            console.log('パラメータオブジェクトが利用できません');
            return;
        }

        // 必須パラメータのチェック
        if (!bookId || !urlSlug) {
            console.error('URLパラメータが不足:', { bookId, urlSlug });
            setLoading(false);
            return;
        }

        // 必須パラメータのチェック
        if (!title || !authors || !publishedDate) {
            console.error('クエリパラメータが不足:', { title, authors, publishedDate });
            setLoading(false);
            return;
        }

        // slugの正当性チェック
        if (!isValidSlug(urlSlug, title)) {
            console.warn('Slugがタイトルと一致しません:', { urlSlug, title });
        }

        // 本の情報を作成
        const bookDetail: BookDetailInfo = {
            id: bookId,
            title,
            authors: authors.split(','),
            publishedDate,
            isbn10: isbn10,
            isbn13: isbn13,
            issn: issn,
            images: {
                thumbnail: thumbnail,
                smallThumbnail: smallThumbnail
            },
            description: null,    // 明示的に null
            pageCount: null,      // 明示的に null
            publisher: null,      // 明示的に null
        };

        // 本の情報をステートに保存
        setBookInfo(bookDetail);
        setLoading(false);
    }, [bookId,
        urlSlug,
        title,
        authors,
        publishedDate,
        isbn10,
        isbn13,
        issn,
        smallThumbnail,
        thumbnail,
        params,
        searchParams]);

    return {
        bookInfo,
        loading,
        displayImage: (bookInfo?.images?.thumbnail || bookInfo?.images?.smallThumbnail || null)
    };
};