export default function Home() {
  return (
    <main className="container">
      <section className="home-hero reveal active">
        <h1 className="hero-name">Umut Yalçın Baki</h1>
        <p className="home-tagline">
          <span className="lang-en">Koç University — Computer Engineering &amp; Economics DM</span>
          <span className="lang-tr">Koç Üniversitesi — Bilgisayar Mühendisliği &amp; Ekonomi ÇAP</span>
        </p>
        <p className="home-bio">
          <span className="lang-en">
            Computer Engineering &amp; Economics double major. I like building things that make sense.
          </span>
          <span className="lang-tr">Bilgisayar Mühendisliği &amp; Ekonomi ÇAP öğrencisi.</span>
        </p>

        <div className="home-links">
          <a
            href="https://github.com/umutybaki"
            target="_blank"
            rel="noopener noreferrer"
            className="home-link"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/umutybaki"
            target="_blank"
            rel="noopener noreferrer"
            className="home-link"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </a>
          <a href="/blog" className="home-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Lecture Notes
          </a>
        </div>
      </section>
    </main>
  )
}