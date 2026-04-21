import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'tr']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (!hasLocale) {
    const redirectPath = pathname === '/' ? '/en' : `/en${pathname}`
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
}

export const config = {
  // Skip _next internals, API routes, and static files (anything with a file extension)
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
