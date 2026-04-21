'use client'

import { type ReactNode } from 'react'

export interface TimelineItemData {
  icon: ReactNode
  iconGlow?: string
  title: ReactNode
  date: string
  description?: ReactNode
  tags?: string[]
}

interface TimelineProps {
  items: TimelineItemData[]
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4 sm:gap-5">
          {/* Left column: icon + connecting line */}
          <div className="flex flex-col items-center shrink-0 w-11">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--surface-color)',
                border: '1.5px solid var(--card-border)',
                boxShadow: item.iconGlow
                  ? `0 0 15px ${item.iconGlow}`
                  : 'var(--card-shadow)',
              }}
            >
              {item.icon}
            </div>
            {i < items.length - 1 && (
              <div
                className="w-px flex-1 min-h-6 mt-2"
                style={{ backgroundColor: 'var(--card-border)' }}
              />
            )}
          </div>

          {/* Right column: content card */}
          <div
            className="flex-1 mb-8 rounded-xl p-5 sm:p-6"
            style={{
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
              <h3 className="text-base font-semibold leading-snug mb-0" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <span
                className="text-xs whitespace-nowrap mt-0.5 sm:mt-1 shrink-0"
                style={{ fontFamily: 'var(--font-roboto-mono), monospace', color: 'var(--text-secondary)' }}
              >
                {item.date}
              </span>
            </div>

            {item.description && (
              <div className="text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-full tracking-wide"
                    style={{
                      backgroundColor: 'var(--accent-muted)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
