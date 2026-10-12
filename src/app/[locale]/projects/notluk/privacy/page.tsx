import { getDictionary } from '@/dictionaries'
import { getAlternates, pageTitle } from '@/lib/metadata'
import { isValidLocale } from '@/lib/locale'
import { defaultLocale } from '@/i18n-config'
import { renderMarkdown } from '@/lib/markdown'
import PageTitle from '@/components/PageTitle'
import BackLink from '@/components/BackLink'
import { privacyPolicy } from './policy'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale)
  return {
    title: pageTitle(dict.notluk.privacyPolicy.pageTitle),
    description: dict.notluk.privacyPolicy.description,
    alternates: getAlternates(locale, '/projects/notluk/privacy'),
  }
}

export default async function NotlukPrivacyPage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const html = await renderMarkdown(privacyPolicy[isValidLocale(locale) ? locale : defaultLocale])

  return (
    <main className="max-w-200 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <BackLink href={`/${locale}/projects/notluk`} label={dict.notluk.privacyPolicy.backToNotluk} />
      <PageTitle>{dict.notluk.privacyPolicy.pageTitle}</PageTitle>
      <article className="markdown-body [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}
