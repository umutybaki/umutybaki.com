import { locales } from '@/i18n-config'
import type { Locale } from '@/i18n-config'

export function isValidLocale(s: string): s is Locale {
  return locales.includes(s as Locale)
}
