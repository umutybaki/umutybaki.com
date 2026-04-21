import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'tr']

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const preferred = acceptLanguage
    .split(',')
    .map(part => part.split(';')[0].trim().toLowerCase().slice(0, 2))
    .find(lang => locales.includes(lang))
  return preferred ?? 'en'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
  // Skip _next internals, API routes, and static files (anything with a file extension)
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
