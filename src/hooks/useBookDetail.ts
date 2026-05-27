import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { isValidSlug } from '@/utils/slugify';
import { BookDetailInfo } from '@/types/book';
import { UseBookDetailReturn } from '@/types/hooks';
import { supabase } from '@/lib/supabase';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
        if (!bookId || !urlSlug) {
            setLoading(false);
            return;
        }

        // UUIDならDBから取得、それ以外はクエリパラメータから構築
        if (UUID_REGEX.test(bookId)) {
            supabase
                .from('books')
                .select('*')
                .eq('id', bookId)
                .single()
                .then(({ data, error }) => {
                    if (error || !data) {
                        setLoading(false);
                        return;
                    }
                    const authors = typeof data.authors === 'string'
                        ? JSON.parse(data.authors)
                        : data.authors;
                    const images = typeof data.thumbnail === 'string'
                        ? JSON.parse(data.thumbnail)
                        : data.thumbnail;
                    setBookInfo({
                        id: data.id,
                        title: data.title,
                        authors,
                        publishedDate: data.published_date ?? '',
                        isbn10: data.isbn10,
                        isbn13: data.isbn13,
                        issn: data.issn,
                        images: images ?? { smallThumbnail: null, thumbnail: null },
                        description: null,
                        pageCount: null,
                        publisher: null,
                    });
                    setLoading(false);
                });
            return;
        }

        // クエリパラメータから構築（API専用書籍）
        if (!title || !authors) {
            setLoading(false);
            return;
        }

        if (!isValidSlug(urlSlug, title)) {
            console.warn('Slugがタイトルと一致しません:', { urlSlug, title });
        }

        setBookInfo({
            id: bookId,
            title,
            authors: authors.split(','),
            publishedDate: publishedDate ?? '',
            isbn10,
            isbn13,
            issn,
            images: { thumbnail, smallThumbnail },
            description: null,
            pageCount: null,
            publisher: null,
        });
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
        thumbnail]);

    return {
        bookInfo,
        loading,
        displayImage: (bookInfo?.images?.thumbnail || bookInfo?.images?.smallThumbnail || null)
    };
};