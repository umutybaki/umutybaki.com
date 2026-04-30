import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '@/middleware'

function makeRequest(path: string, opts: { cookie?: string; acceptLanguage?: string } = {}): NextRequest {
  const url = new URL(path, 'http://localhost:3000')
  const headers = new Headers()
  if (opts.acceptLanguage) headers.set('accept-language', opts.acceptLanguage)
  if (opts.cookie) headers.set('cookie', opts.cookie)
  return new NextRequest(url, { headers })
}

describe('middleware — path skipping', () => {
  it('skips _next paths', () => {
    expect(middleware(makeRequest('/_next/static/chunk.js'))).toBeUndefined()
  })
  it('skips /api paths', () => {
    expect(middleware(makeRequest('/api/health'))).toBeUndefined()
  })
  it('skips paths with a file extension', () => {
    expect(middleware(makeRequest('/favicon.ico'))).toBeUndefined()
    expect(middleware(makeRequest('/robots.txt'))).toBeUndefined()
  })
  it('skips already-localized paths', () => {
    expect(middleware(makeRequest('/en/blog'))).toBeUndefined()
    expect(middleware(makeRequest('/tr/cv'))).toBeUndefined()
    expect(middleware(makeRequest('/en'))).toBeUndefined()
  })
})

describe('middleware — locale detection', () => {
  it('redirects / to /en by default', () => {
    const res = middleware(makeRequest('/'))
    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toContain('/en')
  })

  it('preserves sub-path when redirecting', () => {
    const res = middleware(makeRequest('/about'))
    expect(res?.headers.get('location')).toContain('/en/about')
  })

  it('respects NEXT_LOCALE cookie', () => {
    const res = middleware(makeRequest('/', { cookie: 'NEXT_LOCALE=tr' }))
    expect(res?.headers.get('location')).toContain('/tr')
  })

  it('uses Accept-Language header when no cookie', () => {
    const res = middleware(makeRequest('/', { acceptLanguage: 'tr-TR,tr;q=0.9,en;q=0.8' }))
    expect(res?.headers.get('location')).toContain('/tr')
  })

  it('cookie takes priority over Accept-Language', () => {
    const res = middleware(makeRequest('/', {
      cookie: 'NEXT_LOCALE=en',
      acceptLanguage: 'tr-TR,tr;q=0.9',
    }))
    expect(res?.headers.get('location')).toContain('/en')
  })

  it('falls back to en for unsupported Accept-Language', () => {
    const res = middleware(makeRequest('/', { acceptLanguage: 'fr-FR,fr;q=0.9' }))
    expect(res?.headers.get('location')).toContain('/en')
  })

  it('falls back to en for malformed Accept-Language', () => {
    const res = middleware(makeRequest('/', { acceptLanguage: 'not-valid;q=abc' }))
    expect(res?.headers.get('location')).toContain('/en')
  })

  it('ignores NEXT_LOCALE cookie with unsupported locale', () => {
    const res = middleware(makeRequest('/', { cookie: 'NEXT_LOCALE=fr' }))
    // Falls through to Accept-Language / default → en
    expect(res?.headers.get('location')).toContain('/en')
  })

  it('picks highest-quality supported language from Accept-Language', () => {
    // tr has lower q than en, so en wins
    const res = middleware(makeRequest('/', { acceptLanguage: 'en;q=0.9,tr;q=0.5' }))
    expect(res?.headers.get('location')).toContain('/en')
  })
})
