import { test, expect } from '@playwright/test'

test.describe('theme toggle', () => {
  test('toggles data-theme attribute on <html>', async ({ page }) => {
    await page.goto('/en')

    const initialTheme = await page.evaluate(
      () => document.documentElement.getAttribute('data-theme')
    )

    await page.getByRole('button', { name: /toggle dark mode/i }).click()

    const newTheme = await page.evaluate(
      () => document.documentElement.getAttribute('data-theme')
    )

    expect(newTheme).not.toBe(initialTheme)
    expect(['dark', 'light']).toContain(newTheme)
  })

  test('theme persists across page reload', async ({ page }) => {
    await page.goto('/en')

    // Set to a known state
    const initial = await page.evaluate(
      () => document.documentElement.getAttribute('data-theme')
    )
    if (initial === 'dark') {
      await page.getByRole('button', { name: /toggle dark mode/i }).click()
    }

    const themeBeforeReload = await page.evaluate(
      () => document.documentElement.getAttribute('data-theme')
    )
    expect(themeBeforeReload).toBe('light')

    await page.reload()

    const themeAfterReload = await page.evaluate(
      () => document.documentElement.getAttribute('data-theme')
    )
    expect(themeAfterReload).toBe('light')
  })
})
