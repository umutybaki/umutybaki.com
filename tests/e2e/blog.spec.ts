import { test, expect } from '@playwright/test'

test.describe('blog index', () => {
  test('loads with at least one category', async ({ page }) => {
    await page.goto('/en/blog')
    await expect(page.locator('h1')).toBeVisible()
    // At least one category button should be present
    await expect(page.locator('button[aria-expanded]').first()).toBeVisible()
  })

  test('navigates to a post', async ({ page }) => {
    await page.goto('/en/blog')
    // Click the first post link (not the nav)
    const postLinks = page.locator('main a[href*="/blog/"]')
    await postLinks.first().click()
    // Should land on a post page with an article/content area
    await expect(page.locator('.markdown-body')).toBeVisible()
  })
})

test.describe('blog post sidebar', () => {
  test('desktop sidebar is visible at wide viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/en/blog')
    const postLinks = page.locator('main a[href*="/blog/"]')
    await postLinks.first().click()
    // The desktop sidebar nav should be present in the DOM
    await expect(page.locator('nav[aria-label="Sidebar"]')).toBeVisible()
  })

  test('drawer button visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/en/blog')
    const postLinks = page.locator('main a[href*="/blog/"]')
    await postLinks.first().click()
    await expect(page.getByRole('button', { name: /open sidebar/i })).toBeVisible()
  })
})
