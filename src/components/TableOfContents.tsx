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
    <nav className="toc" aria-label="Table of contents">
      <p className="toc-title">{title}</p>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc-item toc-depth-${heading.depth}`}
          >
            <a
              href={`#${heading.id}`}
              className={`toc-link${activeId === heading.id ? ' toc-link-active' : ''}`}
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