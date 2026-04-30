import { describe, it, expect } from 'vitest'
import { isValidLocale } from '@/lib/locale'

describe('isValidLocale', () => {
  it('accepts en', () => expect(isValidLocale('en')).toBe(true))
  it('accepts tr', () => expect(isValidLocale('tr')).toBe(true))
  it('rejects unknown locale', () => expect(isValidLocale('fr')).toBe(false))
  it('rejects empty string', () => expect(isValidLocale('')).toBe(false))
  it('is case-sensitive', () => expect(isValidLocale('EN')).toBe(false))
  it('rejects partial match', () => expect(isValidLocale('e')).toBe(false))
})
