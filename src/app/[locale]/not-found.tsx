import { getDictionary } from '@/dictionaries'
import { locales, defaultLocale } from '@/i18n-config'
import Link from 'next/link'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function NotFound({ params }: Props) {
  const { locale: localeParam } = await params
  const locale = locales.includes(localeParam as typeof locales[number]) ? localeParam : defaultLocale
  const dict = getDictionary(locale)

  return (
    <main className="max-w-[900px] mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
      <p className="text-lg text-text-secondary mb-8">
        {locale === 'tr' ? 'Aradığınız sayfa bulunamadı.' : 'The page you are looking for was not found.'}
      </p>
      <Link
        href={`/${locale}`}
        className="px-5 py-2.5 bg-accent-color text-white rounded-sm font-medium text-sm hover:opacity-90 transition-opacity"
      >
        {dict.nav.home}
      </Link>
    </main>
  )
}
