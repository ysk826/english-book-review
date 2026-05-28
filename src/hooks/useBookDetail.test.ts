import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBookDetail } from './useBookDetail'
import { useParams, useSearchParams } from 'next/navigation'

vi.mock('next/navigation', () => ({
    useParams: vi.fn(),
    useSearchParams: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: null, error: new Error('not found') }),
                }),
            }),
        }),
    },
}))

// useParams のモックをセットアップするヘルパー
const mockParams = (id: string, slug: string) => {
    vi.mocked(useParams).mockReturnValue({ id, slug })
}

// useSearchParams のモックをセットアップするヘルパー
// URLSearchParams は Next.js の ReadonlyURLSearchParams と同じ .get() インターフェースを持つ
const mockSearchParams = (params: Record<string, string>) => {
    vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams(params) as unknown as ReturnType<typeof useSearchParams>
    )
}

describe('useBookDetail', () => {
    it('全パラメータが揃っているとき bookInfo が正しく構築される', async () => {
        mockParams('9780132350884', 'clean-code')
        mockSearchParams({
            title: 'Clean Code',
            authors: 'Robert Martin',
            publishedDate: '2008-08-01',
            isbn13: '9780132350884',
            isbn10: '0132350882',
        })

        const { result } = renderHook(() => useBookDetail())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.bookInfo).toMatchObject({
            id: '9780132350884',
            title: 'Clean Code',
            authors: ['Robert Martin'],
            publishedDate: '2008-08-01',
            isbn13: '9780132350884',
            isbn10: '0132350882',
        })
    })

    it('effect 実行後に loading が false になる', async () => {
        mockParams('9780132350884', 'clean-code')
        mockSearchParams({
            title: 'Clean Code',
            authors: 'Robert Martin',
            publishedDate: '2008-08-01',
        })

        const { result } = renderHook(() => useBookDetail())

        await waitFor(() => expect(result.current.loading).toBe(false))
    })

    it('必須パラメータが欠けているとき bookInfo が null になる', async () => {
        mockParams('9780132350884', 'clean-code')
        // title を省略
        mockSearchParams({
            authors: 'Robert Martin',
            publishedDate: '2008-08-01',
        })

        const { result } = renderHook(() => useBookDetail())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.bookInfo).toBeNull()
    })

    it('authors がカンマ区切りの場合、配列に分割される', async () => {
        mockParams('9780132350884', 'clean-code')
        mockSearchParams({
            title: 'Clean Code',
            authors: 'Robert Martin,Coauthor Name',
            publishedDate: '2008-08-01',
        })

        const { result } = renderHook(() => useBookDetail())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.bookInfo?.authors).toEqual(['Robert Martin', 'Coauthor Name'])
    })

    it('displayImage は thumbnail を優先して返す', async () => {
        mockParams('9780132350884', 'clean-code')
        mockSearchParams({
            title: 'Clean Code',
            authors: 'Robert Martin',
            publishedDate: '2008-08-01',
            thumbnail: 'http://example.com/thumb.jpg',
            smallThumbnail: 'http://example.com/small.jpg',
        })

        const { result } = renderHook(() => useBookDetail())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.displayImage).toBe('http://example.com/thumb.jpg')
    })

    it('thumbnail がなく smallThumbnail がある場合は smallThumbnail を返す', async () => {
        mockParams('9780132350884', 'clean-code')
        mockSearchParams({
            title: 'Clean Code',
            authors: 'Robert Martin',
            publishedDate: '2008-08-01',
            smallThumbnail: 'http://example.com/small.jpg',
        })

        const { result } = renderHook(() => useBookDetail())

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.displayImage).toBe('http://example.com/small.jpg')
    })
})
