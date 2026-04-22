/**
 * Centralized i18n configuration.
 * Importable from anywhere — including middleware (Edge runtime safe).
 */
export const locales = ['en', 'tr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const siteUrl = 'https://umutybaki.com'
