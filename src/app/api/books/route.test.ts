import { describe, it, expect, vi } from 'vitest'
import { extractValue, formatApiBooks, formatDbBooks } from './route'

// route.ts は supabase をインポートしているのでモジュールレベルでモックする
vi.mock('@/lib/supabase', () => ({
    supabase: {},
}))

// -------------------------------------------------------------------
// extractValue
// -------------------------------------------------------------------
describe('extractValue', () => {
    it('intitle の値を取り出す', () => {
        expect(extractValue('intitle:"Clean Code"', 'intitle')).toBe('Clean Code')
    })

    it('inauthor の値を取り出す', () => {
        expect(extractValue('intitle:"Clean Code" inauthor:"Robert Martin"', 'inauthor')).toBe('Robert Martin')
    })

    it('キーが存在しない場合は null を返す', () => {
        expect(extractValue('intitle:"Clean Code"', 'inauthor')).toBeNull()
    })

    it('空文字列は null を返す', () => {
        expect(extractValue('', 'intitle')).toBeNull()
    })
})

// -------------------------------------------------------------------
// formatApiBooks
// -------------------------------------------------------------------
describe('formatApiBooks', () => {
    const makeItem = (overrides = {}) => ({
        id: 'test-id',
        volumeInfo: {
            title: 'Clean Code',
            authors: ['Robert Martin'],
            language: 'en',
            publishedDate: '2008-08-01',
            imageLinks: {
                smallThumbnail: 'http://example.com/small.jpg',
                thumbnail: 'http://example.com/thumb.jpg',
            },
            industryIdentifiers: [
                { type: 'ISBN_13', identifier: '9780132350884' },
                { type: 'ISBN_10', identifier: '0132350882' },
            ],
            ...overrides,
        },
    })

    it('英語の本を SearchResultBook 形式に変換する', () => {
        const result = formatApiBooks({ items: [makeItem()] })
        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({
            title: 'Clean Code',
            authors: ['Robert Martin'],
            isbn13: '9780132350884',
            isbn10: '0132350882',
            publishedDate: '2008-08-01',
            images: {
                smallThumbnail: 'http://example.com/small.jpg',
                thumbnail: 'http://example.com/thumb.jpg',
            },
        })
    })

    it('英語以外の本はフィルタリングされる', () => {
        const japaneseItem = makeItem({ language: 'ja' })
        const result = formatApiBooks({ items: [japaneseItem] })
        expect(result).toHaveLength(0)
    })

    it('en-US / en-GB も英語として通過する', () => {
        const usItem = makeItem({ language: 'en-US' })
        const gbItem = makeItem({ language: 'en-GB' })
        expect(formatApiBooks({ items: [usItem] })).toHaveLength(1)
        expect(formatApiBooks({ items: [gbItem] })).toHaveLength(1)
    })

    it('著者がない場合は "不明" になる', () => {
        const item = makeItem({ authors: undefined })
        const result = formatApiBooks({ items: [item] })
        expect(result[0].authors).toEqual(['不明'])
    })

    it('ISBN がない場合は null になる', () => {
        const item = makeItem({ industryIdentifiers: undefined })
        const result = formatApiBooks({ items: [item] })
        expect(result[0].isbn13).toBeNull()
        expect(result[0].isbn10).toBeNull()
        expect(result[0].issn).toBeNull()
    })
})

// -------------------------------------------------------------------
// formatDbBooks
// -------------------------------------------------------------------
describe('formatDbBooks', () => {
    const makeDbBook = (overrides = {}) => ({
        id: 'uuid-1',
        title: 'Clean Code',
        authors: ['Robert Martin'],
        thumbnail: { smallThumbnail: 'http://example.com/small.jpg', thumbnail: 'http://example.com/thumb.jpg' },
        published_date: '2008-08-01',
        isbn10: '0132350882',
        isbn13: '9780132350884',
        issn: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        ...overrides,
    })

    it('DB の Book を SearchResultBook 形式に変換する', () => {
        const result = formatDbBooks([makeDbBook()])
        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({
            title: 'Clean Code',
            authors: ['Robert Martin'],
            isbn13: '9780132350884',
            isbn10: '0132350882',
            publishedDate: '2008-08-01',
        })
    })

    it('authors が JSON 文字列でも正しくパースされる', () => {
        const book = makeDbBook({ authors: '["Robert Martin"]' })
        const result = formatDbBooks([book])
        expect(result[0].authors).toEqual(['Robert Martin'])
    })

    it('thumbnail が JSON 文字列でも正しくパースされる', () => {
        const book = makeDbBook({
            thumbnail: '{"smallThumbnail":"http://s.jpg","thumbnail":"http://t.jpg"}',
        })
        const result = formatDbBooks([book])
        expect(result[0].images).toEqual({
            smallThumbnail: 'http://s.jpg',
            thumbnail: 'http://t.jpg',
        })
    })

    it('published_date が null の場合は "不明" になる', () => {
        const book = makeDbBook({ published_date: null })
        const result = formatDbBooks([book])
        expect(result[0].publishedDate).toBe('不明')
    })
})
