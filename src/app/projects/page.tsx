import PageTitle from '@/components/PageTitle'
import PostList from '@/components/PostList'
import AppListItem from '@/components/AppListItem'

export default function ProjectsPage() {
  return (
    <main className="container">
      <section className="projects-section">
        <PageTitle>
          <span className="lang-en">Projects</span>
          <span className="lang-tr">Projeler</span>
        </PageTitle>
        <p>
          <span className="lang-en">A small collection of projects I have created.</span>
          <span className="lang-tr">Geliştirdiğim projelerden küçük bir koleksiyon.</span>
        </p>

        <div style={{ marginTop: '3rem' }}>
          <PostList>
            <AppListItem
              href="https://portwatcher.umutybaki.com"
              logo="/projects/portwatcher.svg"
              logoAlt="PortWatcher Logo"
              name="PortWatcher"
              subtitle={
                <>
                  <span className="lang-en">macOS Menubar App</span>
                  <span className="lang-tr">macOS Menü Çubuğu Uygulaması</span>
                </>
              }
            />
          </PostList>
        </div>
      </section>
    </main>
  )
}