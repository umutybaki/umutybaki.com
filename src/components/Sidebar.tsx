'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { TocItem, CategoryNode } from '@/lib/posts'
import SidebarTree from './SidebarTree'

interface Props {
  headings: TocItem[]
  title: string
  sidebarRoot?: CategoryNode | null
  locale?: string
  currentCategory?: string
  currentSlug?: string
  relatedPostsLabel?: string
  backHref?: string
  backLabel?: string
}

export default function Sidebar({ headings, title, sidebarRoot, locale, currentCategory, currentSlug, relatedPostsLabel, backHref, backLabel }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const ids = headings.map((h) => h.id)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [headings])

  const hasTree = sidebarRoot && locale && currentCategory && currentSlug
  if (!hasTree && headings.length === 0) return null

  return (
    <nav className="sticky top-18 max-h-[calc(100vh-4.5rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pt-6" aria-label="Sidebar">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-[0.35rem] text-[0.75rem] text-text-secondary hover:text-accent-color transition-colors duration-150 mb-4"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {backLabel}
        </Link>
      )}
      {hasTree && (
        <>
          <SidebarTree
            root={sidebarRoot}
            locale={locale}
            currentCategory={currentCategory}
            currentSlug={currentSlug}
            relatedPostsLabel={relatedPostsLabel}
          />
          {headings.length > 0 && <div className="border-t border-border-color my-4" />}
        </>
      )}

      {headings.length > 0 && (
        <>
          {title && <p className="font-roboto-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-text-secondary mb-3">{title}</p>}
          <ul className="list-none border-l border-border-color">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={`leading-[1.4] ${heading.depth === 2 ? 'pl-3' : heading.depth === 3 ? 'pl-6' : ''}`}
              >
                <a
                  href={`#${heading.id}`}
                  className={`block px-2 py-[0.28rem] text-[0.78rem] text-text-secondary border-l-2 border-transparent -ml-px transition-colors duration-150 leading-[1.4] hover:text-text-primary hover:opacity-100${activeId === heading.id ? ' text-accent-color! border-l-accent-color!' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  )
}