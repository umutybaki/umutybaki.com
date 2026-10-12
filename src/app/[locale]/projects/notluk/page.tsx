import Link from 'next/link'
import { getDictionary } from '@/dictionaries'
import { getAlternates, pageTitle } from '@/lib/metadata'
import BackLink from '@/components/BackLink'
import type { Metadata } from 'next'

const CONTACT_EMAIL = 'ubaki22@ku.edu.tr'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale)
  return {
    title: pageTitle('Notluk'),
    description: dict.notluk.description,
    alternates: getAlternates(locale, '/projects/notluk'),
  }
}

export default async function NotlukPage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const t = dict.notluk

  return (
    <main className="max-w-225 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <BackLink href={`/${locale}/projects`} label={t.backToProjects} />

      <header className="flex items-center gap-4 md:gap-5 mb-6">
        <img
          src="/media/notluk.png"
          alt=""
          width="72"
          height="72"
          className="w-16 h-16 md:w-18 md:h-18 rounded-[16px]"
        />
        <div>
          <h1 className="text-[1.75rem] md:text-[2rem] mb-0 font-bold tracking-[-0.02em]">Notluk</h1>
          <p className="mb-0">{t.tagline}</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-8 font-roboto-mono text-[0.8rem]">
        <span className="border border-border-color rounded-md px-2.5 py-1 text-text-secondary">{t.platforms}</span>
        <span className="rounded-md px-2.5 py-1 bg-accent-muted text-accent-color">{t.status}</span>
      </div>

      <p className="text-[1.05rem] leading-[1.7] max-w-180 mb-12">{t.intro}</p>

      <section className="mb-12">
        <h2 className="text-[1.25rem]">{t.featuresHeading}</h2>
        <ul className="list-none grid gap-[0.4rem] md:grid-cols-2">
          {t.features.map((feature) => (
            <li key={feature.title} className="border border-border-color rounded-md p-4 md:p-5 md:last:odd:col-span-2">
              <div className="font-semibold mb-1">{feature.title}</div>
              <p className="text-[0.9rem] leading-[1.6] mb-0">{feature.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-[1.25rem]">{t.privacyHeading}</h2>
        <p className="max-w-180">{t.privacySummary}</p>
        <Link href={`/${locale}/projects/notluk/privacy`}>{t.privacyLink} →</Link>
      </section>

      <section className="mb-0">
        <h2 className="text-[1.25rem]">{t.contactHeading}</h2>
        <p className="mb-0">
          {t.contactBody} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>
    </main>
  )
}
