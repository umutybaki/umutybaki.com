'use client'

import { useEffect } from 'react'

export default function MermaidInit() {
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default'
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme })
      mermaid.run({ querySelector: '.mermaid' })
    })
  }, [])

  return null
}