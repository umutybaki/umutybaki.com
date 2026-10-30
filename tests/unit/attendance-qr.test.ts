import { describe, expect, it } from 'vitest'
import { isSharingPhone, safeQRLink } from '@/lib/attendance-qr'

describe('attendance QR links', () => {
  it('accepts only ordinary HTTP links without embedded credentials', () => {
    expect(safeQRLink('https://example.com/check-in?a=1')).toBe(
      'https://example.com/check-in?a=1',
    )
    for (const value of [
      'javascript:alert(1)',
      'data:text/html,hello',
      'file:///tmp/test',
      'https://user:password@example.com',
      'plain text',
      null,
    ])
      expect(safeQRLink(value)).toBe('')
  })
  it('keeps desktop and tablet devices out of camera sharing', () => {
    expect(
      isSharingPhone({ userAgent: 'Mozilla iPhone', maxTouchPoints: 5 }),
    ).toBe(true)
    expect(
      isSharingPhone({
        userAgent: 'Mozilla Android Mobile',
        maxTouchPoints: 5,
      }),
    ).toBe(true)
    expect(
      isSharingPhone({ userAgent: 'Mozilla Windows NT', maxTouchPoints: 10 }),
    ).toBe(false)
    expect(
      isSharingPhone({ userAgent: 'Mozilla iPad', maxTouchPoints: 5 }),
    ).toBe(false)
  })
})
