'use client'

import { type ReactNode, useState, useEffect } from 'react'

export interface TimelineItemData {
  icon: ReactNode
  iconGlow?: string
  title: ReactNode
  date: string
  description?: ReactNode
  tags?: string[]
  details?: ReactNode
}

interface TimelineProps {
  items: TimelineItemData[]
}

export default function Timeline({ items }: TimelineProps) {
  const [selectedItem, setSelectedItem] = useState<TimelineItemData | null>(null)

  useEffect(() => {
    if (!selectedItem) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedItem])

  return (
    <>
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isClickable = !!item.details;
        return (
          <div key={i} className="flex gap-4 sm:gap-5">
            {/* Left column: icon + connecting line */}
            <div className="flex flex-col items-center shrink-0 w-11">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-surface-color border-[1.5px] border-card-border"
                style={{
                  boxShadow: item.iconGlow
                    ? `0 0 15px ${item.iconGlow}`
                    : 'var(--card-shadow)',
                }}
              >
                {item.icon}
              </div>
              {i < items.length - 1 && (
                <div className="w-px flex-1 min-h-6 mt-2 bg-card-border" />
              )}
            </div>

            {/* Right column: content card */}
            <div
              className={`flex-1 mb-8 rounded-xl p-5 sm:p-6 bg-surface-color border border-card-border shadow-(--card-shadow) ${isClickable ? 'cursor-pointer hover:-translate-y-0.5 hover:border-accent-color/40 hover:shadow-lg transition-all duration-200 group relative' : ''}`}
              onClick={isClickable ? () => setSelectedItem(item) : undefined}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                <h3 className="text-base font-semibold leading-snug mb-0 text-text-primary">
                  {item.title}
                </h3>
                <span className="text-xs whitespace-nowrap mt-0.5 sm:mt-1 shrink-0 font-roboto-mono text-text-secondary">
                  {item.date}
                </span>
              </div>

              {item.description && (
                <div className="text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 text-text-secondary">
                  {item.description}
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 rounded-full tracking-wide bg-accent-muted text-accent-color"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {isClickable && (
                <span className="block text-[0.65rem] text-text-secondary mt-4 font-roboto-mono tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">
                  Click to learn more ▸
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>

      {/* Modal Popup overlay */ }
  {
    selectedItem && (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-s z-1000 flex items-center justify-center p-4 transition-opacity"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedItem(null)
        }}
      >
        <div
          className="bg-surface-color border border-card-border rounded-2xl w-full max-w-170 max-h-[88vh] overflow-y-auto relative shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar"
          style={{ animation: 'pop-in 0.25s ease' }}
        >
          <div className="sticky top-0 bg-surface-color/95 backdrop-blur-sm z-10 px-7 py-6 border-b border-card-border flex justify-between items-start gap-4">
            <div>
              <span className="block text-[0.7rem] tracking-widest uppercase font-roboto-mono text-accent-color mb-1.5">
                {selectedItem.date}
              </span>
              <h3 className="text-xl font-semibold text-text-primary leading-snug m-0">
                {selectedItem.title}
              </h3>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="shrink-0 p-1.5 rounded-md border border-card-border text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:border-accent-color/30 transition-all focus:outline-none"
              aria-label="Close popup"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="px-7 py-6">
            {selectedItem.details}
          </div>
        </div>
      </div>
    )
  }

  <style dangerouslySetInnerHTML={{
    __html: `
        @keyframes pop-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color, #333); border-radius: 3px; }
      `}} />
    </>
  )
}
