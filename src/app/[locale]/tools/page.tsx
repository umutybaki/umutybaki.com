import { getDictionary } from '@/dictionaries'
import { getAlternates, pageTitle } from '@/lib/metadata'
import PageTitle from '@/components/PageTitle'
import AppListItem from '@/components/AppListItem'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale)
  return {
    title: pageTitle(dict.tools.pageTitle),
    description: dict.tools.subtitle,
    alternates: getAlternates(locale, '/tools'),
  }
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)

  return (
    <main className="max-w-225 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <section>
        <PageTitle>{dict.tools.pageTitle}</PageTitle>
        <p>{dict.tools.subtitle}</p>

        <ul className="list-none flex flex-col gap-[0.4rem] mt-12">
          <AppListItem
            href={`/${locale}/tools/qr-code-generator`}
            logo="/media/qr-code-generator.svg"
            logoAlt={dict.tools.qrCodeGeneratorName}
            name={dict.tools.qrCodeGeneratorName}
            subtitle={dict.tools.qrCodeGeneratorSubtitle}
            external={false}
          />
        </ul>
      </section>
    </main>
  )
}
