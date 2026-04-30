import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SidebarDrawer from '@/components/SidebarDrawer'
import type { TocItem } from '@/lib/posts'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// SidebarTree tries to render next/link inside Sidebar — mock SidebarTree to keep tests focused
vi.mock('@/components/SidebarTree', () => ({
  default: () => <div data-testid="sidebar-tree" />,
}))

const headings: TocItem[] = [
  { id: 'intro', text: 'Introduction', depth: 2 },
]

const baseProps = {
  headings,
  title: 'Contents',
  backHref: '/en/blog',
  backLabel: 'Back',
}

describe('SidebarDrawer — no content', () => {
  it('renders nothing when headings are empty and no tree', () => {
    const { container } = render(
      <SidebarDrawer {...baseProps} headings={[]} />
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('SidebarDrawer — open/close', () => {
  it('shows the open button when there is content', () => {
    render(<SidebarDrawer {...baseProps} />)
    expect(screen.getByRole('button', { name: /open sidebar/i })).toBeInTheDocument()
  })

  it('opens the drawer when the button is clicked', async () => {
    const user = userEvent.setup()
    render(<SidebarDrawer {...baseProps} />)

    // The drawer panel is the fixed left-side div; it's aria-hidden when closed
    const drawer = document.querySelector('.fixed.left-0.top-18')
    expect(drawer).toHaveAttribute('aria-hidden', 'true')

    await user.click(screen.getByRole('button', { name: /open sidebar/i }))
    expect(drawer).toHaveAttribute('aria-hidden', 'false')
  })

  it('closes the drawer when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<SidebarDrawer {...baseProps} />)

    await user.click(screen.getByRole('button', { name: /open sidebar/i }))
    await user.keyboard('{Escape}')

    const drawer = screen.getByTestId('sidebar-backdrop').nextElementSibling!
    expect(drawer).toHaveAttribute('aria-hidden', 'true')
  })

  it('closes the drawer when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(<SidebarDrawer {...baseProps} />)

    await user.click(screen.getByRole('button', { name: /open sidebar/i }))

    const backdrop = screen.getByTestId('sidebar-backdrop')
    await user.click(backdrop)

    const drawer = backdrop.nextElementSibling!
    expect(drawer).toHaveAttribute('aria-hidden', 'true')
  })
})
