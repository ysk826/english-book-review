import { describe, it, expect } from 'vitest'
import { generateBookSlug, generateBookUrl, isValidSlug } from './slugify'

describe('generateBookSlug', () => {
    it('小文字・ハイフン区切りに変換する', () => {
        expect(generateBookSlug('The Great Gatsby')).toBe('the-great-gatsby')
    })

    it('特殊文字を除去する', () => {
        expect(generateBookSlug('To Kill a Mockingbird!')).toBe('to-kill-a-mockingbird')
    })

    it('コロンを除去してハイフン区切りにする', () => {
        expect(generateBookSlug('1984: A Novel')).toBe('1984-a-novel')
    })

    it('空文字は untitled を返す', () => {
        expect(generateBookSlug('')).toBe('untitled')
    })

    it('100文字を超える場合は切り詰める', () => {
        const longTitle = 'a'.repeat(200)
        expect(generateBookSlug(longTitle).length).toBeLessThanOrEqual(100)
    })
})

describe('generateBookUrl', () => {
    it('books/{id}/{slug} 形式のURLを返す', () => {
        expect(generateBookUrl('9781234567890', 'The Great Gatsby'))
            .toBe('/books/9781234567890/the-great-gatsby')
    })
})

describe('isValidSlug', () => {
    it('タイトルから生成したslugと一致すればtrueを返す', () => {
        expect(isValidSlug('the-great-gatsby', 'The Great Gatsby')).toBe(true)
    })

    it('一致しなければfalseを返す', () => {
        expect(isValidSlug('wrong-slug', 'The Great Gatsby')).toBe(false)
    })
})
