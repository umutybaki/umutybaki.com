import type { Dictionary } from './types'
import type { Locale } from '@/i18n-config'
import en from './en'
import tr from './tr'

const dictionaries: Record<Locale, Dictionary> = { en, tr }

export function getDictionary(locale: string): Dictionary {
  return (dictionaries as Record<string, Dictionary>)[locale] ?? dictionaries.en
}
