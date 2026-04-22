import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/i18n-config'

/**
 * Parse Accept-Language header with quality values.
 * Returns languages sorted by descending quality.
 */
function parseAcceptLanguage(header: string): { lang: string; q: number }[] {
  return header
    .split(',')
    .map((part) => {
      const [langRaw, qRaw] = part.trim().split(';q=')
      const lang = langRaw.trim().toLowerCase().slice(0, 2)
      const q = qRaw ? parseFloat(qRaw) : 1
      return { lang, q: isNaN(q) ? 0 : q }
    })
    .sort((a, b) => b.q - a.q)
}

function getPreferredLocale(request: NextRequest): string {
  // 1. Cookie preference (set when user explicitly switches language)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale as typeof locales[number])) {
    return cookieLocale
  }

  // 2. Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const parsed = parseAcceptLanguage(acceptLanguage)
  const match = parsed.find((l) => locales.includes(l.lang as typeof locales[number]))
  if (match) return match.lang

  // 3. Default
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, API routes, and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (!hasLocale) {
    const locale = getPreferredLocale(request)
    const redirectPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
