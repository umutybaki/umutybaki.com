import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Sidebar from '@/components/Sidebar'
import { triggerIntersection } from '../setup'
import type { TocItem } from '@/lib/posts'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const headings: TocItem[] = [
  { id: 'intro', text: 'Introduction', depth: 2 },
  { id: 'details', text: 'Details', depth: 3 },
  { id: 'summary', text: 'Summary', depth: 2 },
]

describe('Sidebar — rendering', () => {
  it('renders nothing when no headings and no tree', () => {
    const { container } = render(<Sidebar headings={[]} title="On this page" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders heading list when headings are provided', () => {
    render(<Sidebar headings={headings} title="On this page" />)
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('Summary')).toBeInTheDocument()
  })

  it('renders the title label', () => {
    render(<Sidebar headings={headings} title="On this page" />)
    expect(screen.getByText('On this page')).toBeInTheDocument()
  })

  it('renders back link when backHref is provided', () => {
    render(<Sidebar headings={headings} title="" backHref="/en/blog" backLabel="Back to Blog" />)
    const link = screen.getByText('Back to Blog')
    expect(link.closest('a')).toHaveAttribute('href', '/en/blog')
  })

  it('does not render back link when backHref is absent', () => {
    render(<Sidebar headings={headings} title="" />)
    expect(screen.queryByRole('link', { name: /back/i })).toBeNull()
  })
})

describe('Sidebar — heading depth classes', () => {
  it('applies pl-3 to h2 headings', () => {
    render(<Sidebar headings={[{ id: 'h2', text: 'H2', depth: 2 }]} title="" />)
    const li = screen.getByText('H2').closest('li')
    expect(li).toHaveClass('pl-3')
  })

  it('applies pl-6 to h3 headings', () => {
    render(<Sidebar headings={[{ id: 'h3', text: 'H3', depth: 3 }]} title="" />)
    const li = screen.getByText('H3').closest('li')
    expect(li).toHaveClass('pl-6')
  })
})

describe('Sidebar — IntersectionObserver active heading', () => {
  it('applies active styles when a heading intersects', async () => {
    // Render headings with real DOM elements so the observer can target them
    document.body.innerHTML = '<div id="intro"></div>'
    render(<Sidebar headings={headings} title="" />)

    const introEl = document.getElementById('intro')!
    await act(async () => { triggerIntersection(introEl, true) })

    const link = screen.getByRole('link', { name: 'Introduction' })
    expect(link.className).toContain('text-accent-color!')
  })

  it('removes active styles when heading leaves viewport', async () => {
    document.body.innerHTML = '<div id="intro"></div>'
    render(<Sidebar headings={headings} title="" />)

    const introEl = document.getElementById('intro')!
    await act(async () => { triggerIntersection(introEl, true) })
    await act(async () => { triggerIntersection(introEl, false) })

    const link = screen.getByRole('link', { name: 'Introduction' })
    expect(link.className).not.toContain('text-accent-color!')
  })

  it('picks the topmost heading when multiple are intersecting', async () => {
    document.body.innerHTML = '<div id="intro"></div><div id="summary"></div>'
    render(<Sidebar headings={headings} title="" />)

    const introEl = document.getElementById('intro')!
    const summaryEl = document.getElementById('summary')!

    await act(async () => {
      triggerIntersection(summaryEl, true)
      triggerIntersection(introEl, true)
    })

    // intro comes first in the headings array — it should be active
    const introLink = screen.getByRole('link', { name: 'Introduction' })
    expect(introLink.className).toContain('text-accent-color!')

    const summaryLink = screen.getByRole('link', { name: 'Summary' })
    expect(summaryLink.className).not.toContain('text-accent-color!')
  })
})
