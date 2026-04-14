'use client'

import { useEffect } from 'react'

export default function MarkdownTheme() {
  useEffect(() => {
    const link = document.getElementById('markdown-theme-style') as HTMLLinkElement | null
    if (!link) return

    function updateTheme() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      link!.href = isDark ? '/github-markdown-dark.css' : '/github-markdown-light.css'
    }

    updateTheme()

    // Watch for theme changes on the html element
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => observer.disconnect()
  }, [])

  return (
    // eslint-disable-next-line @next/next/no-css-tags
    <link id="markdown-theme-style" rel="stylesheet" href="/github-markdown-dark.css" />
  )
}