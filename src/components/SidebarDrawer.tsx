'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from './Sidebar'
import type { TocItem, CategoryNode } from '@/lib/posts'

interface Props {
  headings: TocItem[]
  title: string
  backHref: string
  backLabel: string
  sidebarRoot?: CategoryNode | null
  locale?: string
  currentCategory?: string
  currentSlug?: string
}

export default function SidebarDrawer({ headings, title, backHref, backLabel, sidebarRoot, locale, currentCategory, currentSlug }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const hasContent = headings.length > 0 || (sidebarRoot && locale && currentCategory && currentSlug)

  return (
    <>
      {/* Sticky top bar */}
      <div className="sticky top-18 z-30 flex items-center gap-3 py-3 mb-6">
        {hasContent && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Open sidebar"
            className="min-[1100px]:hidden inline-flex items-center gap-[0.4rem] text-text-secondary text-[0.875rem] bg-[rgba(249,249,247,0.85)] dark:bg-[rgba(24,24,24,0.85)] backdrop-blur-[10px] border border-border-color rounded-sm px-3 py-1 transition-colors duration-150 hover:text-accent-color"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="16" y2="12" />
              <line x1="3" y1="18" x2="11" y2="18" />
            </svg>
            {title}
          </button>
        )}

        <Link
          href={backHref}
          className="inline-flex items-center gap-[0.4rem] text-text-secondary text-[0.875rem] bg-[rgba(249,249,247,0.85)] dark:bg-[rgba(24,24,24,0.85)] backdrop-blur-[10px] border border-border-color rounded-sm px-3 py-1 transition-colors duration-150 hover:text-accent-color"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {backLabel}
        </Link>
      </div>

      {hasContent && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className={`min-[1100px]:hidden fixed inset-x-0 top-18 bottom-0 z-40 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className={`min-[1100px]:hidden fixed left-0 top-18 h-[calc(100vh-4.5rem)] z-50 w-64 bg-[rgba(249,249,247,0.85)] dark:bg-[rgba(24,24,24,0.85)] backdrop-blur-[10px] border-r border-border-color shadow-xl flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}
            aria-hidden={!open}
          >
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <Sidebar
                headings={headings}
                title={title}
                sidebarRoot={sidebarRoot}
                locale={locale}
                currentCategory={currentCategory}
                currentSlug={currentSlug}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}