'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import jsQR from 'jsqr'
import PageTitle from '@/components/PageTitle'
import { gatherICE, isSharingPhone, safeQRLink } from '@/lib/attendance-qr'
import type { Copy } from './copy'

const API = process.env.NEXT_PUBLIC_ATTENDANCE_QR_API_URL
const button =
  'rounded-lg px-5 py-3 border border-(--accent-hover-border-strong) hover:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed'
type Peer = { peer: string; offer: string; answer?: string }
type Reply = {
  token: string
  epoch: string
  active: boolean
  sharing: boolean
  peers: Peer[]
  answer: string
}
class APIError extends Error {
  constructor(public status: number) {
    super(`API ${status}`)
  }
}

export default function AttendanceQR({
  locale,
  t,
}: {
  locale: string
  t: Copy
}) {
  const [code, setCode] = useState('')
  const [token, setToken] = useState('')
  const [phone, setPhone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [active, setActive] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const [link, setLink] = useState('')
  const [scannedAt, setScannedAt] = useState(0)
  const video = useRef<HTMLVideoElement>(null)
  const stream = useRef<MediaStream | null>(null)
  const epoch = useRef('')
  const isSharing = useRef(false)
  const answeredOffers = useRef(new Map<string, string>())
  const peers = useRef(new Map<string, RTCPeerConnection>())
  const channels = useRef(new Set<RTCDataChannel>())
  const revision = useRef(0)
  const incomingScan = useRef(0)
  const latestQR = useRef({ url: '', scannedAt: 0 })
  const starting = useRef(false)
  const alive = useRef(true)

  async function call(
    action: string,
    data: object = {},
    auth = token,
  ): Promise<Reply> {
    if (!API) throw new Error(t.unavailable)
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      },
      body: JSON.stringify({ action, ...data }),
      signal: AbortSignal.timeout(12000),
      cache: 'no-store',
    })
    if (!res.ok) throw new APIError(res.status)
    return res.json()
  }
  function clearMedia() {
    revision.current++
    peers.current.forEach((pc) => pc.close())
    peers.current.clear()
    answeredOffers.current.clear()
    channels.current.forEach((ch) => ch.close())
    channels.current.clear()
    stream.current?.getTracks().forEach((track) => track.stop())
    stream.current = null
    if (video.current) video.current.srcObject = null
    isSharing.current = false
    epoch.current = ''
    incomingScan.current = 0
    if (alive.current) {
      setSharing(false)
      setConnected(false)
    }
  }
  function release(keepalive = false) {
    if (API && token && isSharing.current)
      void fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'release', epoch: epoch.current }),
        keepalive,
      }).catch(() => {})
    clearMedia()
  }
  function newPeer(): RTCPeerConnection {
    const iceServers: RTCIceServer[] = [
      { urls: 'stun:stun.l.google.com:19302' },
    ]
    const pc = new RTCPeerConnection({ iceServers })
    pc.onconnectionstatechange = () => {
      if (
        isSharing.current &&
        ['failed', 'closed'].includes(pc.connectionState)
      ) {
        for (const [id, current] of peers.current)
          if (current === pc) peers.current.delete(id)
        return
      }
      if (!alive.current) return
      if (pc.connectionState === 'failed') {
        setError(t.network)
        if (!isSharing.current) {
          clearMedia()
        }
      }
      if (
        !isSharing.current &&
        ['disconnected', 'closed'].includes(pc.connectionState)
      ) {
        setConnected(false)
      }
      if (!isSharing.current && pc.connectionState === 'connected') {
        setConnected(true)
        setError('')
      }
    }
    return pc
  }
  function receiveChannel(ch: RTCDataChannel) {
    ch.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const url = safeQRLink(data.url)
        if (
          url &&
          Number.isFinite(data.scannedAt) &&
          data.scannedAt > incomingScan.current
        ) {
          incomingScan.current = data.scannedAt
          setLink(url)
          setScannedAt(data.scannedAt)
        }
      } catch {
        /* Ignore invalid peer messages. */
      }
    }
    channels.current.add(ch)
  }
  async function watch(roomEpoch: string) {
    if (starting.current) return
    clearMedia()
    epoch.current = roomEpoch
    const rev = revision.current
    const pc = newPeer()
    peers.current.set('sharer', pc)
    const ch = pc.createDataChannel('qr', { ordered: false, maxRetransmits: 0 })
    receiveChannel(ch)
    pc.addTransceiver('video', { direction: 'recvonly' })
    pc.ontrack = (event) => {
      if (revision.current !== rev) return
      if (video.current) {
        video.current.srcObject =
          event.streams[0] ?? new MediaStream([event.track])
        void video.current.play().catch(() => {})
      }
    }
    try {
      await pc.setLocalDescription(await pc.createOffer())
      await gatherICE(pc)
      if (revision.current !== rev) return
      await call('offer', { epoch: roomEpoch, sdp: pc.localDescription!.sdp })
    } catch (e) {
      if (revision.current === rev) {
        clearMedia()
        setError(e instanceof APIError ? t.error : t.network)
      }
    }
  }
  async function answer(peer: Peer, roomEpoch: string) {
    const existing = peers.current.get(peer.peer)
    if (!existing && answeredOffers.current.get(peer.peer) === peer.offer) return
    if (
      existing &&
      (existing.remoteDescription?.sdp === peer.offer ||
        !existing.remoteDescription)
    )
      return
    if (existing) {
      existing.close()
      peers.current.delete(peer.peer)
    }
    if (!stream.current) return
    const rev = revision.current
    const pc = newPeer()
    peers.current.set(peer.peer, pc)
    pc.ondatachannel = (event) => {
      const ch = event.channel
      channels.current.add(ch)
      ch.onopen = () => {
        if (latestQR.current.url) ch.send(JSON.stringify(latestQR.current))
      }
      ch.onclose = () => channels.current.delete(ch)
    }
    try {
      for (const track of stream.current.getVideoTracks()) {
        const sender = pc.addTrack(track, stream.current)
        const params = sender.getParameters()
        params.encodings = [{ maxFramerate: 2, maxBitrate: 2500000 }]
        params.degradationPreference = 'maintain-resolution'
        await sender.setParameters(params)
      }
      await pc.setRemoteDescription({ type: 'offer', sdp: peer.offer })
      await pc.setLocalDescription(await pc.createAnswer())
      await gatherICE(pc)
      if (revision.current !== rev) return
      await call('answer', {
        epoch: roomEpoch,
        peer: peer.peer,
        offer: peer.offer,
        sdp: pc.localDescription!.sdp,
      })
      if (revision.current === rev) answeredOffers.current.set(peer.peer, peer.offer)
    } catch {
      pc.close()
      peers.current.delete(peer.peer)
    }
  }
  async function start() {
    starting.current = true
    setBusy(true)
    setError('')
    let claimed = ''
    try {
      const camera = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 2, max: 2 },
        },
      })
      if (!alive.current) {
        camera.getTracks().forEach((track) => track.stop())
        return
      }
      const track = camera.getVideoTracks()[0],
        settings = track.getSettings()
      if (
        Math.min(settings.width ?? 0, settings.height ?? 0) < 720 ||
        Math.max(settings.width ?? 0, settings.height ?? 0) < 1280
      ) {
        camera.getTracks().forEach((track) => track.stop())
        throw new Error(t.camera)
      }
      clearMedia()
      latestQR.current = { url: '', scannedAt: 0 }
      stream.current = camera
      const result = await call('claim')
      claimed = result.epoch
      if (!alive.current) {
        await call('release', { epoch: claimed })
        camera.getTracks().forEach((track) => track.stop())
        return
      }
      epoch.current = claimed
      isSharing.current = true
      setSharing(true)
      setActive(true)
      track.onended = () => release()
      if (video.current) {
        video.current.srcObject = camera
        await video.current.play()
      }
    } catch (e) {
      if (claimed) void call('release', { epoch: claimed }).catch(() => {})
      clearMedia()
      setError(e instanceof APIError && e.status === 409 ? t.busy : t.camera)
    } finally {
      starting.current = false
      setBusy(false)
    }
  }
  useEffect(() => {
    setPhone(isSharingPhone(navigator))
  }, [])
  useEffect(() => {
    alive.current = true
    const leave = () => release(true)
    const hide = () => {
      if (document.hidden && isSharing.current) release(true)
    }
    window.addEventListener('pagehide', leave)
    document.addEventListener('visibilitychange', hide)
    return () => {
      alive.current = false
      leave()
      window.removeEventListener('pagehide', leave)
      document.removeEventListener('visibilitychange', hide)
    }
    // Media cleanup belongs to the authenticated room lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])
  useEffect(() => {
    if (!token) return
    let stopped = false,
      running = false,
      failures = 0
    async function tick() {
      if (stopped || running || starting.current) return
      running = true
      try {
        const state = await call('status')
        if (stopped || starting.current) return
        setActive(state.active)
        if (isSharing.current) {
          if (!state.sharing || state.epoch !== epoch.current) {
            clearMedia()
            return
          }
          await call('heartbeat', { epoch: epoch.current })
          const list = await call('peers', { epoch: epoch.current })
          // ICE gathering must not delay the independent lease renewal on the next tick.
          void Promise.all(list.peers.map((p) => answer(p, epoch.current)))
        } else if (!state.active) {
          if (epoch.current) clearMedia()
        } else if (epoch.current !== state.epoch) {
          await watch(state.epoch)
        } else {
          const pc = peers.current.get('sharer')
          if (pc && !pc.remoteDescription) {
            const result = await call('connection', { epoch: epoch.current })
            if (!stopped && result.answer)
              await pc.setRemoteDescription({
                type: 'answer',
                sdp: result.answer,
              })
          }
        }
        failures = 0
      } catch (e) {
        if (stopped) return
        if (e instanceof APIError && e.status === 401) {
          release()
          setToken('')
          setError(t.expired)
        } else if (e instanceof APIError && e.status === 409) {
          clearMedia()
        } else if (++failures >= 2) {
          release()
          setError(t.error)
        }
      } finally {
        running = false
      }
    }
    void tick()
    const timer = setInterval(() => void tick(), 2000)
    return () => {
      stopped = true
      clearInterval(timer)
    }
    // Refs hold live connection state without restarting the room loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])
  useEffect(() => {
    const canvas = document.createElement('canvas'),
      context = canvas.getContext('2d', { willReadFrequently: true })
    let lastTime = -1
    const timer = setInterval(() => {
      if (!isSharing.current) return
      const v = video.current
      if (!v || !context || v.readyState < 2 || v.currentTime === lastTime)
        return
      lastTime = v.currentTime
      canvas.width = v.videoWidth
      canvas.height = v.videoHeight
      context.drawImage(v, 0, 0)
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
      const qr = jsQR(pixels.data, pixels.width, pixels.height, {
        inversionAttempts: 'dontInvert',
      })
      const url = safeQRLink(qr?.data)
      if (url && url !== latestQR.current.url) {
        latestQR.current = { url, scannedAt: Date.now() }
        setLink(url)
        setScannedAt(latestQR.current.scannedAt)
      }
      // Repeat the latest scan so an unordered, unretransmitted packet can be lost safely.
      if (latestQR.current.url)
        for (const ch of channels.current)
          if (ch.readyState === 'open' && ch.bufferedAmount < 4096)
            ch.send(JSON.stringify(latestQR.current))
    }, 200)
    return () => clearInterval(timer)
  }, [])
  async function join(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await call('join', { code })
      setLink('')
      setScannedAt(0)
      setToken(result.token)
    } catch (e) {
      setError(
        e instanceof APIError && e.status === 401
          ? locale === 'tr'
            ? 'Kod yanlış.'
            : 'Incorrect code.'
          : t.error,
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <main className="max-w-225 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <Link href={`/${locale}/tools`} className="text-sm opacity-70">
        ← {t.back}
      </Link>
      <PageTitle>{t.title}</PageTitle>
      <p>{t.subtitle}</p>
      {!API && (
        <p role="status" className="mt-6">
          {t.unavailable}
        </p>
      )}
      {!token ? (
        <form onSubmit={join} className="mt-10 max-w-sm flex flex-col gap-4">
          <label htmlFor="room-code">{t.code}</label>
          <input
            id="room-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="rounded-lg border p-4 text-2xl tracking-[0.4em] bg-transparent"
          />
          <button
            className={button}
            disabled={busy || code.length !== 6 || !API}
          >
            {busy ? t.joining : t.join}
          </button>
          <p className="text-sm opacity-60">{t.hint}</p>
        </form>
      ) : (
        <section className="mt-8 flex flex-col gap-5">
          <div role="status" className="text-sm">
            {sharing || connected
              ? '● ' + t.live
              : active
                ? t.connecting
                : t.waiting}
          </div>
          <video
            ref={video}
            autoPlay
            playsInline
            muted
            className={`w-full max-h-[60vh] rounded-xl bg-black object-contain ${!active ? 'hidden' : ''}`}
          />
          <p className="text-xs opacity-60">{t.quality}</p>
          <div
            className="rounded-xl border border-(--accent-hover-border-strong) p-5 break-all min-h-28"
            aria-live="polite"
          >
            {link ? (
              <>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="inline-block rounded-lg bg-orange-600 text-white px-5 py-3 font-medium"
                >
                  {t.open} ↗
                </a>
                <p className="mt-3 text-sm">{link}</p>
                <p className="mt-2 text-xs opacity-50">
                  {t.scannedAt}{' '}
                  {new Date(scannedAt).toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </>
            ) : (
              <p>{t.noQR}</p>
            )}
          </div>
          <p className="text-xs opacity-60">{t.linkHint}</p>
          <div className="flex flex-wrap gap-3">
            {sharing ? (
              <button onClick={() => release()} className={button}>
                {t.stop}
              </button>
            ) : (
              phone && (
                <button
                  onClick={() => void start()}
                  disabled={active || busy}
                  className={button}
                >
                  {busy ? t.starting : t.share}
                </button>
              )
            )}
            <button
              onClick={() => {
                release()
                setToken('')
                setActive(false)
              }}
              disabled={busy}
              className={button}
            >
              {t.leave}
            </button>
          </div>
          <p className="text-sm opacity-70">{phone ? t.aim : t.phone}</p>
        </section>
      )}
      {error && (
        <p role="alert" className="mt-5 text-orange-600">
          {error}
        </p>
      )}
    </main>
  )
}
