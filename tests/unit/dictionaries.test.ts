import { describe, it, expect } from 'vitest'
import { getDictionary } from '@/dictionaries'

describe('getDictionary', () => {
  it('returns English dictionary for "en"', () => {
    const dict = getDictionary('en')
    expect(dict.nav.home).toBeDefined()
    expect(typeof dict.nav.home).toBe('string')
  })

  it('returns Turkish dictionary for "tr"', () => {
    const en = getDictionary('en')
    const tr = getDictionary('tr')
    // Turkish and English nav labels should differ
    expect(tr.nav.home).not.toBe(en.nav.home)
  })

  it('falls back to English for an unknown locale', () => {
    const en = getDictionary('en')
    const unknown = getDictionary('fr')
    expect(unknown.nav.home).toBe(en.nav.home)
  })

  it('falls back to English for empty string', () => {
    const en = getDictionary('en')
    expect(getDictionary('').nav.home).toBe(en.nav.home)
  })

  it('Turkish dictionary has all the same top-level keys as English', () => {
    const en = getDictionary('en')
    const tr = getDictionary('tr')
    // Recursively check all string leaf keys exist in both
    function checkKeys(a: unknown, b: unknown, path: string[] = []): string[] {
      const missing: string[] = []
      if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
        for (const key of Object.keys(a as Record<string, unknown>)) {
          const sub = checkKeys(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key],
            [...path, key]
          )
          missing.push(...sub)
        }
      } else if (typeof a === 'string' && typeof b !== 'string') {
        missing.push(path.join('.'))
      }
      return missing
    }
    const missing = checkKeys(en, tr)
    expect(missing).toEqual([])
  })
})
