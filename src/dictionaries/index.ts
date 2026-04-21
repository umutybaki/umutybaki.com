import type { Dictionary } from './types'
import en from './en'
import tr from './tr'

const dictionaries: Record<string, Dictionary> = { en, tr }

// Locales with actual translations — expand when a new dictionary file is added
export const AVAILABLE_LOCALES = Object.keys(dictionaries)

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale] ?? dictionaries.en
}
