export function safeQRLink(value: unknown): string {
  if (typeof value !== 'string' || value.length > 4096) return ''
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : ''
  } catch {
    return ''
  }
}
export function isSharingPhone(
  nav: Pick<Navigator, 'userAgent' | 'maxTouchPoints'>,
): boolean {
  return (
    /Android.*Mobile|iPhone|iPod/i.test(nav.userAgent) && nav.maxTouchPoints > 0
  )
}
export async function gatherICE(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === 'complete') return
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup()
      reject(new Error('ICE timeout'))
    }, 10000)
    const check = () => {
      if (pc.iceGatheringState === 'complete') {
        cleanup()
        resolve()
      }
    }
    const cleanup = () => {
      clearTimeout(timer)
      pc.removeEventListener('icegatheringstatechange', check)
    }
    pc.addEventListener('icegatheringstatechange', check)
    check()
  })
}
