'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import SidebarTree from './SidebarTree'
import type { SidebarProps } from './sidebar-types'

export default function Sidebar({ headings, title, sidebarRoot, locale, currentCategory, currentSlug, relatedPostsLabel, backHref, backLabel }: SidebarProps) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const intersectingRef = useRef(new Set<string>())
  const linkRefsRef = useRef(new Map<string, HTMLAnchorElement>())
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const ids = headings.map((h) => h.id)
    const intersecting = intersectingRef.current

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id)
          } else {
            intersecting.delete(entry.target.id)
          }
        }
        // Pick the topmost heading visible in the shrunk viewport; if none, fall back to the last one scrolled past
        const candidate = ids.find((id) => intersecting.has(id))
        if (candidate) {
          setActiveId(candidate)
        } else {
          let lastAbove = ''
          for (const id of ids) {
            const el = document.getElementById(id)
            if (el && el.getBoundingClientRect().top < 0) lastAbove = id
          }
          setActiveId(lastAbove)
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
      intersecting.clear()
    }
  }, [headings])

  useEffect(() => {
    if (!activeId) return
    const el = linkRefsRef.current.get(activeId)
    const container = navRef.current
    if (!el || !container) return
    const padding = el.offsetHeight * 2
    const elTop = el.offsetTop
    const elBottom = elTop + el.offsetHeight
    if (elTop - padding < container.scrollTop) {
      container.scrollTo({ behavior: 'smooth', top: elTop - padding })
    } else if (elBottom + padding > container.scrollTop + container.clientHeight) {
      container.scrollTo({ behavior: 'smooth', top: elBottom + padding - container.clientHeight })
    }
  }, [activeId])

  const hasTree = sidebarRoot && locale && currentCategory && currentSlug
  if (!hasTree && headings.length === 0) return null

  return (
    <nav ref={navRef} className="sticky top-18 max-h-[calc(100vh-4.5rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pt-6" aria-label="Sidebar">
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
                  ref={(el) => { if (el) linkRefsRef.current.set(heading.id, el); else linkRefsRef.current.delete(heading.id) }}
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
