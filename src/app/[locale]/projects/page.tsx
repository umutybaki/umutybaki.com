import { getDictionary } from '@/dictionaries'
import PageTitle from '@/components/PageTitle'
import PostList from '@/components/PostList'
import AppListItem from '@/components/AppListItem'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)

  return (
    <main className="container">
      <section className="projects-section">
        <PageTitle>{dict.projects.pageTitle}</PageTitle>
        <p>{dict.projects.subtitle}</p>

        <div style={{ marginTop: '3rem' }}>
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
