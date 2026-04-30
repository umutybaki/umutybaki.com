import { test, expect } from '@playwright/test'

test.describe('locale routing', () => {
  test('/ redirects to /en', async ({ page }) => {
    await page.goto('/')
    expect(page.url()).toContain('/en')
  })

  test('/ respects NEXT_LOCALE cookie for Turkish', async ({ page, context }) => {
    await context.addCookies([{
      name: 'NEXT_LOCALE',
      value: 'tr',
      domain: 'localhost',
      path: '/',
    }])
    await page.goto('/')
    expect(page.url()).toContain('/tr')
  })

  test('/en resolves without redirect', async ({ page }) => {
    await page.goto('/en')
    expect(page.url()).toMatch(/\/en$/)
  })
})

test.describe('page availability', () => {
  test('/en/blog loads', async ({ page }) => {
    await page.goto('/en/blog')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('/en/projects loads', async ({ page }) => {
    await page.goto('/en/projects')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('/en/cv loads', async ({ page }) => {
    await page.goto('/en/cv')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('/en/nonexistent shows 404', async ({ page }) => {
    const response = await page.goto('/en/nonexistent')
    expect(response?.status()).toBe(404)
  })
})
