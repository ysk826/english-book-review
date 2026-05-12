import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBookSearch } from './useBookSearch'
import axios from 'axios'

vi.mock('axios')

const mockBooks = [
    {
        title: 'Clean Code',
        authors: ['Robert Martin'],
        publishedDate: '2008-08-01',
        isbn13: '9780132350884',
        isbn10: null,
        issn: null,
        images: { smallThumbnail: null, thumbnail: null },
    },
]

// axios.get が呼ばれた URL を取得してデコードするヘルパー
// encodeURIComponent されているので decodeURIComponent で戻して検証する
const getDecodedUrl = () => {
    const calledUrl = vi.mocked(axios.get).mock.calls[0][0] as string
    return decodeURIComponent(calledUrl)
}

describe('useBookSearch', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(window, 'alert').mockImplementation(() => { })
    })

    it('初期状態では searchResults が空で loading が false', () => {
        const { result } = renderHook(() => useBookSearch())

        expect(result.current.searchResults).toEqual([])
        expect(result.current.loading).toBe(false)
        expect(result.current.titleQuery).toBe('')
        expect(result.current.authorQuery).toBe('')
    })

    it('タイトルのみで検索すると intitle クエリが作られる', async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: { items: mockBooks } })

        const { result } = renderHook(() => useBookSearch())
        act(() => result.current.setTitleQuery('Clean Code'))

        await act(async () => { await result.current.handleSearchBook() })

        expect(getDecodedUrl()).toContain('intitle:"Clean Code"')
        expect(getDecodedUrl()).not.toContain('inauthor')
    })

    it('著者のみで検索すると inauthor クエリが作られる', async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: { items: mockBooks } })

        const { result } = renderHook(() => useBookSearch())
        act(() => result.current.setAuthorQuery('Robert Martin'))

        await act(async () => { await result.current.handleSearchBook() })

        expect(getDecodedUrl()).toContain('inauthor:"Robert Martin"')
        expect(getDecodedUrl()).not.toContain('intitle')
    })

    it('タイトルと著者の両方で検索すると両方を含むクエリが作られる', async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: { items: mockBooks } })

        const { result } = renderHook(() => useBookSearch())
        act(() => {
            result.current.setTitleQuery('Clean Code')
            result.current.setAuthorQuery('Robert Martin')
        })

        await act(async () => { await result.current.handleSearchBook() })

        expect(getDecodedUrl()).toContain('intitle:"Clean Code"')
        expect(getDecodedUrl()).toContain('inauthor:"Robert Martin"')
    })

    it('検索結果が返ると searchResults に格納される', async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: { items: mockBooks } })

        const { result } = renderHook(() => useBookSearch())
        act(() => result.current.setTitleQuery('Clean Code'))

        await act(async () => { await result.current.handleSearchBook() })

        expect(result.current.searchResults).toEqual(mockBooks)
    })

    it('入力なしで検索するとアラートが出て API は呼ばれない', async () => {
        const { result } = renderHook(() => useBookSearch())

        await act(async () => { await result.current.handleSearchBook() })

        expect(window.alert).toHaveBeenCalledWith('タイトルまたは著者を入力してください')
        expect(axios.get).not.toHaveBeenCalled()
    })

    it('検索結果が空のときアラートが出る', async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: { items: [] } })

        const { result } = renderHook(() => useBookSearch())
        act(() => result.current.setTitleQuery('存在しない本'))

        await act(async () => { await result.current.handleSearchBook() })

        expect(window.alert).toHaveBeenCalledWith('検索結果が見つかりませんでした')
    })

    it('API エラー時にアラートが出る', async () => {
        vi.mocked(axios.get).mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useBookSearch())
        act(() => result.current.setTitleQuery('Clean Code'))

        await act(async () => { await result.current.handleSearchBook() })

        expect(window.alert).toHaveBeenCalledWith('本の取得に失敗しました')
    })
})
