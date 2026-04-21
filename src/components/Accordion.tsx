'use client'

import { useState, type ReactNode } from 'react'

interface AccordionProps {
  title: ReactNode
  titleClassName?: string
  defaultOpen?: boolean
  children: ReactNode
}

export default function Accordion({
  title,
  titleClassName = 'text-[0.7rem] font-roboto-mono text-accent-color font-semibold uppercase tracking-[0.12em]',
  defaultOpen = false,
  children,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 cursor-pointer bg-transparent border-none py-2 text-left mb-3"
      >
        <h2 className={`${titleClassName} mb-0`}>
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
          className={`text-accent-color shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div className={`grid transition-[grid-template-rows] duration-200 ease-in ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
