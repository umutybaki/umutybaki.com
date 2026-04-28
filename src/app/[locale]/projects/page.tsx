import { getDictionary } from '@/dictionaries'
import { getAlternates, pageTitle } from '@/lib/metadata'
import PageTitle from '@/components/PageTitle'
import PostList from '@/components/PostList'
import AppListItem from '@/components/AppListItem'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale)
  return {
    title: pageTitle(dict.projects.pageTitle),
    description: dict.projects.subtitle,
    alternates: getAlternates(locale, '/projects'),
  }
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)

  return (
    <main className="max-w-225 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <section>
        <PageTitle>{dict.projects.pageTitle}</PageTitle>
        <p>{dict.projects.subtitle}</p>

        <div className="mt-12">
          <PostList>
            <AppListItem
              href="https://portwatcher.umutybaki.com"
              logo="/media/portwatcher.svg"
              logoAlt="PortWatcher Logo"
              name="PortWatcher"
              subtitle={dict.projects.portWatcherSubtitle}
            />
          </PostList>
        </div>
      </section>
    </main>
  )
}
