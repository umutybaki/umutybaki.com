import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Nav from '@/components/Nav'
import en from '@/dictionaries/en'

const mockPush = vi.fn()
let mockPathname = '/en/blog'

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Stub localStorage so .setItem is spyable
const localStorageMock = { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() }
vi.stubGlobal('localStorage', localStorageMock)

const dict = en.nav

function renderNav(locale = 'en', availableLocales = ['en', 'tr']) {
  return render(<Nav locale={locale} dict={dict} availableLocales={availableLocales} />)
}

beforeEach(() => {
  mockPush.mockReset()
  localStorageMock.setItem.mockReset()
  mockPathname = '/en/blog'
  document.documentElement.setAttribute('data-theme', 'dark')
})

describe('Nav — language toggle', () => {
  it('enables language button when other locale is available', () => {
    renderNav('en', ['en', 'tr'])
    expect(screen.getByRole('button', { name: /toggle language/i })).not.toBeDisabled()
  })

  it('disables language button when other locale is unavailable', () => {
    renderNav('en', ['en'])
    expect(screen.getByRole('button', { name: /toggle language/i })).toBeDisabled()
  })

  it('navigates to the other locale path on click', async () => {
    const user = userEvent.setup()
    mockPathname = '/en/blog'
    renderNav('en', ['en', 'tr'])
    await user.click(screen.getByRole('button', { name: /toggle language/i }))
    expect(mockPush).toHaveBeenCalledWith('/tr/blog')
  })

  it('navigates correctly from the root locale path', async () => {
    const user = userEvent.setup()
    mockPathname = '/en'
    renderNav('en', ['en', 'tr'])
    await user.click(screen.getByRole('button', { name: /toggle language/i }))
    expect(mockPush).toHaveBeenCalledWith('/tr')
  })

  it('sets NEXT_LOCALE cookie on language switch', async () => {
    const user = userEvent.setup()
    renderNav('en', ['en', 'tr'])
    await user.click(screen.getByRole('button', { name: /toggle language/i }))
    expect(document.cookie).toContain('NEXT_LOCALE=tr')
  })
})

describe('Nav — theme toggle', () => {
  it('switches from dark to light', async () => {
    const user = userEvent.setup()
    document.documentElement.setAttribute('data-theme', 'dark')
    renderNav()
    await user.click(screen.getByRole('button', { name: /toggle dark mode/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('switches from light to dark', async () => {
    const user = userEvent.setup()
    document.documentElement.setAttribute('data-theme', 'light')
    renderNav()
    await user.click(screen.getByRole('button', { name: /toggle dark mode/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('persists theme to localStorage', async () => {
    const user = userEvent.setup()
    document.documentElement.setAttribute('data-theme', 'dark')
    renderNav()
    await user.click(screen.getByRole('button', { name: /toggle dark mode/i }))
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
  })

  it('persists theme to cookie', async () => {
    const user = userEvent.setup()
    renderNav()
    await user.click(screen.getByRole('button', { name: /toggle dark mode/i }))
    expect(document.cookie).toContain('theme=')
  })
})

describe('Nav — mobile menu', () => {
  it('opens the mobile menu when hamburger is clicked', async () => {
    const user = userEvent.setup()
    renderNav()

    // The overlay starts hidden
    const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
    expect(overlay.classList).toContain('-translate-y-full')

    await user.click(screen.getByRole('button', { name: /toggle menu/i }))
    expect(overlay.classList).toContain('translate-y-0')
  })

  it('closes the mobile menu when close button is clicked', async () => {
    const user = userEvent.setup()
    renderNav()

    await user.click(screen.getByRole('button', { name: /toggle menu/i }))

    // The close button is the only <button> inside the overlay
    const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
    const closeButton = overlay.querySelector('button')!
    await user.click(closeButton)

    expect(overlay.classList).toContain('-translate-y-full')
  })

  it('closes the mobile menu when a nav link is clicked', async () => {
    const user = userEvent.setup()
    renderNav()

    await user.click(screen.getByRole('button', { name: /toggle menu/i }))

    // Click the Projects link — pick the one inside the overlay (second match)
    const overlayLinks = screen.getAllByText('Projects')
    const mobileProjectsLink = overlayLinks[1]
    // The link should point to the correct locale path
    expect(mobileProjectsLink.closest('a')).toHaveAttribute('href', '/en/projects')
    await user.click(mobileProjectsLink)

    const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
    expect(overlay.classList).toContain('-translate-y-full')
  })
})
