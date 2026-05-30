import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookAddForm from './BookAddForm'

const defaultProps = {
    status: 'read',
    rating: 0,
    review: '',
    saving: false,
    onStatusChange: vi.fn(),
    onRatingChange: vi.fn(),
    onReviewChange: vi.fn(),
    onSubmit: vi.fn(),
}

describe('BookAddForm', () => {
    it('ステータス・評価・レビューの入力欄とボタンが表示される', () => {
        render(<BookAddForm {...defaultProps} />)

        expect(screen.getByLabelText('読書ステータス')).toBeInTheDocument()
        // 星ボタンが5個表示される
        expect(screen.getAllByRole('button').filter(b => b.textContent?.includes('★'))).toHaveLength(5)
        expect(screen.getByLabelText('レビュー（任意）')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'マイライブラリに追加' })).toBeInTheDocument()
    })

    it('ステータスを変更すると onStatusChange が呼ばれる', async () => {
        const onStatusChange = vi.fn()
        render(<BookAddForm {...defaultProps} onStatusChange={onStatusChange} />)

        await userEvent.selectOptions(screen.getByLabelText('読書ステータス'), 'reading')

        expect(onStatusChange).toHaveBeenCalledWith('reading')
    })

    it('星をクリックすると onRatingChange が数値で呼ばれる', async () => {
        const onRatingChange = vi.fn()
        render(<BookAddForm {...defaultProps} onRatingChange={onRatingChange} />)

        const starButtons = screen.getAllByRole('button').filter(b => b.textContent?.includes('★'))
        await userEvent.click(starButtons[2]) // 3つ目の星 → rating 3

        expect(onRatingChange).toHaveBeenCalledWith(3)
    })

    it('レビューを入力すると onReviewChange が呼ばれる', async () => {
        const onReviewChange = vi.fn()
        render(<BookAddForm {...defaultProps} onReviewChange={onReviewChange} />)

        await userEvent.type(screen.getByLabelText('レビュー（任意）'), '良い本でした')

        expect(onReviewChange).toHaveBeenCalled()
    })

    it('ボタンをクリックすると onSubmit が呼ばれる', async () => {
        const onSubmit = vi.fn()
        render(<BookAddForm {...defaultProps} onSubmit={onSubmit} />)

        await userEvent.click(screen.getByRole('button', { name: 'マイライブラリに追加' }))

        expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    it('saving=true のとき「追加中...」と表示されボタンが disabled になる', () => {
        render(<BookAddForm {...defaultProps} saving={true} />)

        const button = screen.getByRole('button', { name: '追加中...' })
        expect(button).toBeInTheDocument()
        expect(button).toBeDisabled()
    })
})
