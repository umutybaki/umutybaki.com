'use client'
 
 import { useState, type ReactNode } from 'react'
 
 interface AccordionProps {
   title: { en: string; tr: string }
   defaultOpen?: boolean
   children: ReactNode
 }
 
 export default function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
   const [isOpen, setIsOpen] = useState(defaultOpen)
 
   return (
     <section className="mb-24">
       <button
         onClick={() => setIsOpen((prev) => !prev)}
         className="w-full flex items-center justify-between cursor-pointer group bg-transparent border-none p-0 text-left"
         aria-expanded={isOpen}
       >
         <h2
           className="text-3xl font-bold tracking-tight m-0"
           style={{ color: 'var(--text-primary)' }}
         >
           <span className="lang-en">{title.en}</span>
           <span className="lang-tr">{title.tr}</span>
         </h2>
         <svg
           width="24"
           height="24"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="2"
           strokeLinecap="round"
           strokeLinejoin="round"
           className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
           style={{ color: 'var(--text-secondary)' }}
         >
           <polyline points="6 9 12 15 18 9" />
         </svg>
       </button>
 
       {isOpen && (
         <div className="pt-8">
           {children}
         </div>
       )}
     </section>
   )
 }
