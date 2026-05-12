import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookSearchResults from './BookSearchResults'
import { SearchResultBook } from '@/types/book'

// next/image はテスト環境で画像最適化処理を行えないためモックする
vi.mock('next/image', () => ({
    default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

// useRouter の push をモックして遷移先URLを検証できるようにする
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}))

const makeBook = (overrides: Partial<SearchResultBook> = {}): SearchResultBook => ({
    title: 'Clean Code',
    authors: ['Robert Martin'],
    publishedDate: '2008-08-01',
    isbn13: '9780132350884',
    isbn10: '0132350882',
    issn: null,
    images: { smallThumbnail: 'http://example.com/small.jpg', thumbnail: 'http://example.com/thumb.jpg' },
    ...overrides,
})

describe('BookSearchResults', () => {
    beforeEach(() => {
        mockPush.mockClear()
    })

    it('書籍のタイトルと著者が表示される', () => {
        render(<BookSearchResults books={[makeBook()]} />)

        expect(screen.getByText('Clean Code')).toBeInTheDocument()
        expect(screen.getByText('Robert Martin')).toBeInTheDocument()
        expect(screen.getByText('2008-08-01')).toBeInTheDocument()
    })

    it('書籍をクリックすると正しいURLに遷移する', async () => {
        render(<BookSearchResults books={[makeBook()]} />)

        await userEvent.click(screen.getByRole('button', { name: /Clean Code/ }))

        expect(mockPush).toHaveBeenCalledTimes(1)
        // ISBN13 が id になり、タイトルがスラグ化されたURLに遷移する
        expect(mockPush).toHaveBeenCalledWith(
            expect.stringContaining('/books/9780132350884/clean-code')
        )
    })

    it('Enter キーでも書籍ページに遷移する', async () => {
        render(<BookSearchResults books={[makeBook()]} />)

        screen.getByRole('button', { name: /Clean Code/ }).focus()
        await userEvent.keyboard('{Enter}')

        expect(mockPush).toHaveBeenCalledTimes(1)
        expect(mockPush).toHaveBeenCalledWith(
            expect.stringContaining('/books/9780132350884/clean-code')
        )
    })

    it('画像URLがある場合は img が表示される', () => {
        render(<BookSearchResults books={[makeBook()]} />)

        expect(screen.getByRole('img', { name: 'Clean Code' })).toBeInTheDocument()
    })

    it('画像URLがない場合は img が表示されない', () => {
        const book = makeBook({ images: { smallThumbnail: null, thumbnail: null } })
        render(<BookSearchResults books={[book]} />)

        expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('ISBN13 がある場合は ISBN13 が表示される', () => {
        render(<BookSearchResults books={[makeBook()]} />)

        expect(screen.getByText('ISBN13: 9780132350884')).toBeInTheDocument()
    })

    it('ISBN13 がなく ISBN10 がある場合は ISBN10 が表示される', () => {
        const book = makeBook({ isbn13: null })
        render(<BookSearchResults books={[book]} />)

        expect(screen.queryByText(/ISBN13/)).not.toBeInTheDocument()
        expect(screen.getByText('ISBN10: 0132350882')).toBeInTheDocument()
    })
})
