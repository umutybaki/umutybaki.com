import { locales, siteUrl, type Locale } from '@/i18n-config'

/**
 * Build hreflang alternates for a page.
 * @param locale  Current locale (used for canonical)
 * @param path    Path AFTER the locale segment, e.g. "/blog" or "/blog/comp201"
 */
export function getAlternates(locale: string, path: string) {
  const languages: Record<string, string> = {}
  for (const l of locales) {
    languages[l] = `${siteUrl}/${l}${path}`
  }
  return {
    canonical: `${siteUrl}/${locale}${path}`,
    languages,
  }
}

/** Compose a page title with the site name. */
export function pageTitle(page: string) {
  return `${page} — Umut Yalçın Baki`
}
