'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [lang, setLang] = useState<'en' | 'tr'>('en')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Sync lang attribute with state on mount
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme')
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`
  }

  function toggleLang() {
    setLang((prev) => {
      const next = prev === 'en' ? 'tr' : 'en'
      document.documentElement.setAttribute('lang', next)
      return next
    })
  }

  return (
    <nav className="main-nav">
      <div className="nav-content">
        <Link href="/" className="nav-name" style={{ position: 'relative', zIndex: 10 }}>
          Umut Yalçın Baki
        </Link>
        
        <div className="nav-centered-links">
          <Link href="/apps" className="nav-link">
            <span className="lang-en">Apps</span>
            <span className="lang-tr">Uygulamalar</span>
          </Link>
          <Link href="/blog" className="nav-link">
            <span className="lang-en">Blog</span>
            <span className="lang-tr">Blog</span>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Dark Mode">
            <svg
              className="sun-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              className="moon-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <button className="lang-toggle" onClick={toggleLang} aria-label="Toggle Language">
            <div className="lang-slider" />
            <span className="lang-label en">EN</span>
            <span className="lang-label tr">TR</span>
          </button>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Toggle Menu"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className={`mobile-menu-sheet ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
           <Link href="/" className="nav-name" onClick={() => setIsMobileMenuOpen(false)}>
             Umut Yalçın Baki
           </Link>
           <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
             <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
           </button>
        </div>
        <div className="mobile-menu-links">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="lang-en">Home</span>
            <span className="lang-tr">Ana Sayfa</span>
          </Link>
          <Link href="/apps" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="lang-en">Apps</span>
            <span className="lang-tr">Uygulamalar</span>
          </Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="lang-en">Blog</span>
            <span className="lang-tr">Blog</span>
          </Link>
        </div>
        <div style={{ marginTop: 'auto', padding: '2rem', display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <a href="https://github.com/umutybaki" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          <a href="https://linkedin.com/in/umutybaki" target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
        </div>
      </div>
    </nav>
  )
}