import PageTitle from '@/components/PageTitle'
import SectionTitle from '@/components/SectionTitle'
import PostList from '@/components/PostList'
import AppListItem from '@/components/AppListItem'

export default function AppsPage() {
  return (
    <main className="container">
      <section className="apps-section">
        <PageTitle>
          <span className="lang-en">Apps</span>
          <span className="lang-tr">Uygulamalar</span>
        </PageTitle>
        <p>
          <span className="lang-en">A small collection of applications I have created.</span>
          <span className="lang-tr">Geliştirdiğim uygulamalardan küçük bir koleksiyon.</span>
        </p>

        <div className="blog-category" style={{ marginTop: '3rem' }}>
          <SectionTitle>
            <span className="lang-en">Pet Projects</span>
            <span className="lang-tr">Hobi Projeleri</span>
          </SectionTitle>
          <PostList>
            <AppListItem
              href="https://portwatcher.umutybaki.com"
              logo="/apps/portwatcher.svg"
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