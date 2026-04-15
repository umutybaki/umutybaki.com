'use client'

import { useState, type ReactNode } from 'react'

interface AccordionProps {
  title: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}

export default function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div style={{ marginBottom: '2rem' }}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          padding: '0.5rem 0',
          textAlign: 'left',
          marginBottom: '0.75rem',
        }}
      >
        <h2 className="blog-category-title" style={{ marginBottom: 0 }}>
          {title}
        </h2>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: 'var(--accent-color)',
            flexShrink: 0,
            transition: 'transform var(--transition-fast)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div className={`accordion-body${isOpen ? ' open' : ''}`}>
        <div className="accordion-body-inner">
          {children}
        </div>
      </div>
    </div>
  )
}
