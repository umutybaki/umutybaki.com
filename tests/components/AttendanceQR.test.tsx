import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AttendanceQR from '@/app/[locale]/tools/attendance-qr/AttendanceQR'
import { copy } from '@/app/[locale]/tools/attendance-qr/copy'

const channel = {
  onmessage: null as null | ((event: { data: string }) => void),
  onclose: null,
  close: vi.fn(),
  readyState: 'open',
}
class FakePC {
  iceGatheringState = 'complete'
  remoteDescription = null
  localDescription = { sdp: 'test-offer' }
  createDataChannel() {
    return channel
  }
  addTransceiver() {}
  createOffer() {
    return Promise.resolve({ type: 'offer', sdp: 'test-offer' })
  }
  setLocalDescription() {
    return Promise.resolve()
  }
  close() {}
}
beforeEach(() => {
  vi.stubGlobal('RTCPeerConnection', FakePC)
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, options: RequestInit) => {
      const { action } = JSON.parse(options.body as string)
      const body =
        action === 'join'
          ? { token: 'a'.repeat(64) }
          : action === 'status'
            ? { active: true, epoch: 'test-epoch' }
            : {}
      return { ok: true, json: async () => body }
    }),
  )
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
describe('attendance QR viewer', () => {
  it('retains the last link and timestamp until a new QR arrives', async () => {
    render(<AttendanceQR locale="en" t={copy.en} />)
    fireEvent.change(screen.getByLabelText(copy.en.code), {
      target: { value: '313131' },
    })
    fireEvent.click(screen.getByText(copy.en.join))
    await waitFor(() => expect(channel.onmessage).toBeTypeOf('function'))
    const scannedAt = Date.now()
    act(() =>
      channel.onmessage!({
        data: JSON.stringify({ url: 'https://example.com/first', scannedAt }),
      }),
    )
    expect(screen.getByRole('link', { name: /Open QR link/ })).toHaveAttribute(
      'href',
      'https://example.com/first',
    )
    expect(screen.getByText(/Scanned at/)).toBeInTheDocument()
    act(() =>
      channel.onmessage!({
        data: JSON.stringify({ url: '', scannedAt: scannedAt + 1000 }),
      }),
    )
    expect(screen.getByRole('link', { name: /Open QR link/ })).toHaveAttribute(
      'href',
      'https://example.com/first',
    )
    act(() =>
      channel.onmessage!({
        data: JSON.stringify({ url: 'javascript:alert(1)', scannedAt }),
      }),
    )
    expect(screen.getByRole('link', { name: /Open QR link/ })).toHaveAttribute(
      'href',
      'https://example.com/first',
    )
    act(() =>
      channel.onmessage!({
        data: JSON.stringify({
          url: 'https://example.com/second',
          scannedAt: scannedAt + 2000,
        }),
      }),
    )
    expect(screen.getByRole('link', { name: /Open QR link/ })).toHaveAttribute(
      'href',
      'https://example.com/second',
    )
    expect(
      screen.queryByRole('button', { name: copy.en.share }),
    ).not.toBeInTheDocument()
  })
})
