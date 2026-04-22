'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Dictionary } from '@/dictionaries/types'

interface NavProps {
  locale: string
  dict: Dictionary['nav']
  availableLocales: string[]
}

export default function Nav({ locale, dict, availableLocales }: NavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const otherLocale = locale === 'en' ? 'tr' : 'en'
  const canSwitch = availableLocales.includes(otherLocale)

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
    if (!canSwitch) return
    const newPath = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${otherLocale}`)
    // Persist preference so middleware doesn't redirect back
    document.cookie = `NEXT_LOCALE=${otherLocale}; path=/; max-age=31536000; SameSite=Lax`
    router.push(newPath)
  }

  return (
    <nav className="sticky top-0 z-100 bg-[rgba(249,249,247,0.85)] dark:bg-[rgba(24,24,24,0.85)] backdrop-blur-[10px] border-b border-border-color transition-colors duration-300">
      <div className="max-w-225 mx-auto px-6 py-4 md:px-8 relative flex justify-between items-center">
        <Link href={`/${locale}`} className="font-semibold text-[0.95rem] text-text-primary tracking-[-0.02em] hover:opacity-65 transition-opacity" style={{ position: 'relative', zIndex: 10 }}>
          Umut Yalçın Baki
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-6 items-center">
          <Link href={`/${locale}/projects`} className="font-[450] text-[0.95rem] text-text-secondary transition-colors duration-150 hover:text-text-primary">
            {dict.projects}
          </Link>
          <Link href={`/${locale}/blog`} className="font-[450] text-[0.95rem] text-text-secondary transition-colors duration-150 hover:text-text-primary">
            {dict.blog}
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <button className="bg-transparent border border-border-color rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-text-secondary transition-colors duration-150 hover:border-accent-color hover:text-accent-color" onClick={toggleTheme} aria-label="Toggle Dark Mode">
            <svg
              className="hidden dark:block"
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
              className="block dark:hidden"
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
          <button className="relative bg-transparent border border-border-color rounded-[20px] flex items-center p-1 w-[84px] h-[34px] cursor-pointer outline-none font-roboto-mono font-semibold text-[0.8rem] transition-colors duration-150 hover:border-accent-color disabled:opacity-[0.35] disabled:cursor-not-allowed disabled:hover:border-border-color" onClick={toggleLang} disabled={!canSwitch} aria-label="Toggle Language">
            <div className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-accent-color rounded-[14px] z-10 transition-transform duration-[400ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] pointer-events-none [[lang=tr]_&]:translate-x-[100%]" />
            <span className="flex-1 text-center z-20 text-text-secondary select-none transition-colors duration-250 [[lang=en]_&]:text-white">EN</span>
            <span className="flex-1 text-center z-20 text-text-secondary select-none transition-colors duration-250 [[lang=tr]_&]:text-white">TR</span>
          </button>

          <button
            className="flex md:hidden bg-transparent border-none text-text-primary cursor-pointer p-1 transition-opacity duration-150 hover:opacity-70 items-center justify-center"
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

      <div className={`fixed inset-0 w-full h-screen bg-bg-color z-[200] flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex justify-between items-center p-4 px-6 border-b border-border-color">
          <Link href={`/${locale}`} className="font-semibold text-[0.95rem] text-text-primary tracking-[-0.02em] hover:opacity-65 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
            Umut Yalçın Baki
          </Link>
          <button className="bg-transparent border-none text-text-primary cursor-pointer p-1 transition-opacity duration-150 hover:opacity-70" onClick={() => setIsMobileMenuOpen(false)}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="flex flex-col p-8 gap-6">
          <Link href={`/${locale}`} onClick={() => setIsMobileMenuOpen(false)} className="text-[1.5rem] font-semibold text-text-primary transition-opacity duration-150 hover:opacity-65">
            {dict.home}
          </Link>
          <Link href={`/${locale}/projects`} onClick={() => setIsMobileMenuOpen(false)} className="text-[1.5rem] font-semibold text-text-primary transition-opacity duration-150 hover:opacity-65">
            {dict.projects}
          </Link>
          <Link href={`/${locale}/blog`} onClick={() => setIsMobileMenuOpen(false)} className="text-[1.5rem] font-semibold text-text-primary transition-opacity duration-150 hover:opacity-65">
            {dict.blog}
          </Link>
          <Link href={`/${locale}/cv`} onClick={() => setIsMobileMenuOpen(false)} className="text-[1.5rem] font-semibold text-text-primary transition-opacity duration-150 hover:opacity-65">
            {dict.cv}
          </Link>
        </div>
        <div style={{ marginTop: 'auto', padding: '2rem', display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <a href="https://github.com/umutybaki" target="_blank" rel="noopener noreferrer" className="font-[450] text-[0.95rem] text-text-secondary transition-colors duration-150 hover:text-text-primary">GitHub</a>
          <a href="https://linkedin.com/in/umutybaki" target="_blank" rel="noopener noreferrer" className="font-[450] text-[0.95rem] text-text-secondary transition-colors duration-150 hover:text-text-primary">LinkedIn</a>
        </div>
      </div>
    </nav>
  )
}
