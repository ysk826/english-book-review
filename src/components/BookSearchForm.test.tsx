import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookSearchForm from './BookSearchForm'

const defaultProps = {
    titleQuery: '',
    setTitleQuery: vi.fn(),
    authorQuery: '',
    setAuthorQuery: vi.fn(),
    loading: false,
    handleSearchBook: vi.fn(),
}

describe('BookSearchForm', () => {
    it('タイトル・著者の入力欄とラベルが表示される', () => {
        render(<BookSearchForm {...defaultProps} />)

        expect(screen.getByLabelText('タイトル')).toBeInTheDocument()
        expect(screen.getByLabelText('著者')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument()
    })

    it('タイトルを入力すると setTitleQuery が呼ばれる', async () => {
        const setTitleQuery = vi.fn()
        render(<BookSearchForm {...defaultProps} setTitleQuery={setTitleQuery} />)

        await userEvent.type(screen.getByLabelText('タイトル'), 'Clean Code')

        expect(setTitleQuery).toHaveBeenCalled()
        // 最後の呼び出しで入力した末尾の文字が渡される
        expect(setTitleQuery).toHaveBeenLastCalledWith('e')
    })

    it('著者を入力すると setAuthorQuery が呼ばれる', async () => {
        const setAuthorQuery = vi.fn()
        render(<BookSearchForm {...defaultProps} setAuthorQuery={setAuthorQuery} />)

        await userEvent.type(screen.getByLabelText('著者'), 'Robert')

        expect(setAuthorQuery).toHaveBeenCalled()
        expect(setAuthorQuery).toHaveBeenLastCalledWith('t')
    })

    it('検索ボタンをクリックすると handleSearchBook が呼ばれる', async () => {
        const handleSearchBook = vi.fn()
        render(<BookSearchForm {...defaultProps} handleSearchBook={handleSearchBook} />)

        await userEvent.click(screen.getByRole('button', { name: '検索' }))

        expect(handleSearchBook).toHaveBeenCalledTimes(1)
    })

    it('loading=true のとき「検索中...」と表示される', () => {
        render(<BookSearchForm {...defaultProps} loading={true} />)

        expect(screen.getByRole('button', { name: '検索中...' })).toBeInTheDocument()
    })

    it('loading=true のときボタンが disabled になる', () => {
        render(<BookSearchForm {...defaultProps} loading={true} />)

        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('loading=true のときボタンをクリックしても handleSearchBook は呼ばれない', async () => {
        const handleSearchBook = vi.fn()
        render(<BookSearchForm {...defaultProps} loading={true} handleSearchBook={handleSearchBook} />)

        await userEvent.click(screen.getByRole('button'))

        expect(handleSearchBook).not.toHaveBeenCalled()
    })
})
