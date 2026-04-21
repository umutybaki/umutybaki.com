'use client'

import { useEffect, useRef, useState } from 'react'
import type { TocItem } from '@/lib/posts'

interface Props {
  headings: TocItem[]
  title: string
}

export default function TableOfContents({ headings, title }: Props) {
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

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-[4.5rem] max-h-[calc(100vh-4.5rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pt-6" aria-label="Table of contents">
      <p className="font-roboto-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-text-secondary mb-3">{title}</p>
      <ul className="list-none border-l border-border-color">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`leading-[1.4] ${heading.depth === 2 ? 'pl-3' : heading.depth === 3 ? 'pl-6' : ''}`}
          >
            <a
              href={`#${heading.id}`}
              className={`block px-2 py-[0.28rem] text-[0.78rem] text-text-secondary border-l-2 border-transparent -ml-[1px] transition-colors duration-150 leading-[1.4] hover:text-text-primary hover:opacity-100${activeId === heading.id ? ' !text-accent-color !border-l-accent-color' : ''}`}
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
    </nav>
  )
}