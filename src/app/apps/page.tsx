import Link from 'next/link'

export default function AppsPage() {
  return (
    <main className="container">
      <section className="apps-section">
        <h1 className="section-title">
          <span className="lang-en">Apps</span>
          <span className="lang-tr">Uygulamalar</span>
        </h1>
        <p>
          <span className="lang-en">A small collection of applications I have created.</span>
          <span className="lang-tr">Geliştirdiğim uygulamalardan küçük bir koleksiyon.</span>
        </p>

        <div className="blog-category" style={{ marginTop: '3rem' }}>
          <h2 className="blog-category-title">
            <span className="lang-en">Pet Projects</span>
            <span className="lang-tr">Hobi Projeleri</span>
          </h2>
          <ul className="blog-post-list">
            <li className="blog-post-item">
              <a
                href="https://portwatcher.umutybaki.com"
                className="blog-post-link app-item-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/apps/portwatcher.svg"
                  alt="PortWatcher Logo"
                  width="48"
                  height="48"
                  className="app-item-logo"
                  style={{ borderRadius: '10px' }}
                />
                <div style={{ flex: 1 }}>
                  <div className="blog-post-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>PortWatcher</div>
                  <div className="blog-post-date" style={{ marginLeft: 0, marginTop: '0.2rem', fontSize: '0.85rem' }}>
                    <span className="lang-en">macOS Menubar App</span>
                    <span className="lang-tr">macOS Menü Çubuğu Uygulaması</span>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
