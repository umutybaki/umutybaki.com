import { describe, it, expect } from 'vitest'
import { getAlternates, pageTitle } from '@/lib/metadata'

describe('pageTitle', () => {
  it('appends site name with em dash separator', () => {
    expect(pageTitle('Blog')).toBe('Blog — Umut Yalçın Baki')
  })
  it('works with empty string', () => {
    expect(pageTitle('')).toBe(' — Umut Yalçın Baki')
  })
})

describe('getAlternates', () => {
  it('builds canonical URL for given locale and path', () => {
    const { canonical } = getAlternates('en', '/blog')
    expect(canonical).toBe('https://umutybaki.com/en/blog')
  })

  it('includes all locales in languages map', () => {
    const { languages } = getAlternates('en', '/blog')
    expect(languages['en']).toBe('https://umutybaki.com/en/blog')
    expect(languages['tr']).toBe('https://umutybaki.com/tr/blog')
  })

  it('handles empty path', () => {
    const { canonical, languages } = getAlternates('en', '')
    expect(canonical).toBe('https://umutybaki.com/en')
    expect(languages['tr']).toBe('https://umutybaki.com/tr')
  })

  it('sets canonical to the current locale URL', () => {
    const { canonical } = getAlternates('tr', '/cv')
    expect(canonical).toBe('https://umutybaki.com/tr/cv')
  })
})
