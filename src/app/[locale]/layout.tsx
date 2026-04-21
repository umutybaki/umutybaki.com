import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import { getDictionary, AVAILABLE_LOCALES } from '@/dictionaries'

const locales = ['en', 'tr']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <>
      <Nav locale={locale} dict={dict.nav} availableLocales={AVAILABLE_LOCALES} />
      {children}
    </>
  )
}
