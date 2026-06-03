'use client'

import { useState, useRef, useCallback } from 'react'
import QRCode from 'react-qr-code'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const SIZES = [128, 256, 512] as const
type Size = typeof SIZES[number]

const PADDINGS = [0, 2, 4, 8, 16, 32] as const
type Padding = typeof PADDINGS[number]

const SIZE_DEFAULT_PADDING: Record<Size, Padding> = { 128: 4, 256: 8, 512: 16 }

// The white box (QR + padding) always scales to fill this many pixels in the preview.
const PREVIEW_BOX = 264

const dict = {
  en: {
    back: 'Tools',
    title: 'QR Code Generator',
    subtitle: 'Enter any URL or text to generate a QR code.',
    placeholder: 'Enter URL',
    size: 'Size',
    padding: 'Padding',
    downloadSVG: 'Download SVG',
    downloadPNG: 'Download PNG',
    previewWord: 'preview',
  },
  tr: {
    back: 'Araçlar',
    title: 'QR Kod Oluşturucu',
    subtitle: 'QR kod oluşturmak için herhangi bir URL veya metin girin.',
    placeholder: 'URL girin',
    size: 'Boyut',
    padding: 'Kenar boşluğu',
    downloadSVG: 'SVG indir',
    downloadPNG: 'PNG indir',
    previewWord: 'önizleme',
  },
} as const

function PreviewPattern({ word }: { word: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => (
          <span
            key={`${row}-${col}`}
            className="absolute text-text-primary opacity-[0.045] font-roboto-mono text-sm whitespace-nowrap"
            style={{
              top: `${row * 70 - 20}px`,
              left: `${col * 100 - 20 + (row % 2) * 50}px`,
              transform: 'rotate(-22deg)',
            }}
          >
            {word}
          </span>
        ))
      )}
    </div>
  )
}

const btnBase =
  'px-2.5 py-1 rounded text-[0.8rem] font-roboto-mono border transition-colors duration-150'
const btnActive = 'border-accent-color text-accent-color'
const btnIdle =
  'border-border-color text-text-secondary hover:text-text-primary hover:border-[var(--accent-hover-border)]'

export default function QRCodeGeneratorPage() {
  const params = useParams()
  const locale = (params.locale as string) === 'tr' ? 'tr' : 'en'
  const t = dict[locale]

  const [value, setValue] = useState('')
  const [size, setSize] = useState<Size>(256)
  const [padding, setPadding] = useState<Padding>(8)
  const qrRef = useRef<HTMLDivElement>(null)

  function handleSizeChange(s: Size) {
    setSize(s)
    setPadding(SIZE_DEFAULT_PADDING[s])
  }

  const buildPaddedSVG = useCallback(() => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return null
    const viewBox = svg.getAttribute('viewBox') ?? `0 0 ${size} ${size}`
    const total = size + padding * 2
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}"><rect width="${total}" height="${total}" fill="white"/><svg x="${padding}" y="${padding}" width="${size}" height="${size}" viewBox="${viewBox}">${svg.innerHTML}</svg></svg>`
  }, [size, padding])

  const downloadSVG = useCallback(() => {
    const svgStr = buildPaddedSVG()
    if (!svgStr) return
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-code.svg'
    a.click()
    URL.revokeObjectURL(url)
  }, [buildPaddedSVG])

  const downloadPNG = useCallback(() => {
    const svgStr = buildPaddedSVG()
    if (!svgStr) return
    const total = size + padding * 2
    const canvas = document.createElement('canvas')
    canvas.width = total
    canvas.height = total
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = 'qr-code.png'
      a.click()
    }
    img.src = url
  }, [buildPaddedSVG, size, padding])

  const hasValue = value.trim().length > 0

  // Scale QR size and padding proportionally so the preview matches the download ratio
  const scale = PREVIEW_BOX / (size + padding * 2)
  const previewQRSize = Math.round(size * scale)
  const previewPadding = Math.round(padding * scale)

  return (
    <main className="max-w-225 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <Link
        href={`/${locale}/tools`}
        className="inline-flex items-center gap-1.5 text-[0.85rem] text-text-secondary font-roboto-mono mb-8 hover:text-text-primary transition-colors duration-150"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {t.back}
      </Link>

      <h1 className="text-[1.75rem] md:text-[2rem] font-bold tracking-[-0.02em] mb-3">
        {t.title}
      </h1>
      <p className="text-text-secondary text-[0.95rem] mb-10">
        {t.subtitle}
      </p>

      <div className="flex flex-col md:flex-row gap-10 md:items-start">

        {/* Controls */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={t.placeholder}
            className="w-full px-4 py-3 rounded-md border border-border-color bg-transparent text-text-primary placeholder:text-text-secondary font-roboto-mono text-base outline-none focus:border-accent-color transition-colors duration-150"
          />

          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="text-[0.8rem] text-text-secondary font-roboto-mono">{t.size}</span>
            <div className="flex gap-1">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => handleSizeChange(s)}
                  className={`${btnBase} ${size === s ? btnActive : btnIdle}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="text-[0.8rem] text-text-secondary font-roboto-mono">{t.padding}</span>
            <div className="flex gap-1">
              {PADDINGS.map(p => (
                <button
                  key={p}
                  onClick={() => setPadding(p)}
                  className={`${btnBase} ${padding === p ? btnActive : btnIdle}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center md:justify-start">
            <button
              onClick={downloadSVG}
              disabled={!hasValue}
              className="px-4 py-2 rounded-md border border-border-color text-[0.9rem] font-[450] text-text-primary transition-all duration-150 hover:bg-surface-hover hover:border-[var(--accent-hover-border)] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-border-color"
            >
              {t.downloadSVG}
            </button>
            <button
              onClick={downloadPNG}
              disabled={!hasValue}
              className="px-4 py-2 rounded-md border border-border-color text-[0.9rem] font-[450] text-text-primary transition-all duration-150 hover:bg-surface-hover hover:border-[var(--accent-hover-border)] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-border-color"
            >
              {t.downloadPNG}
            </button>
          </div>
        </div>

        {/* Preview — fixed visual size regardless of selected output size */}
        <div className="w-72 flex-none mx-auto md:mx-0">
          <div className="relative overflow-hidden rounded-md border border-border-color bg-surface-hover aspect-square">
            <PreviewPattern word={t.previewWord} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                ref={qrRef}
                style={{ padding: previewPadding, backgroundColor: '#ffffff', display: 'inline-flex' }}
              >
                {hasValue ? (
                  <QRCode value={value} size={previewQRSize} level="Q" />
                ) : (
                  <div
                    className="flex items-center justify-center text-[0.85rem] text-[#aaa] font-roboto-mono select-none"
                    style={{ width: previewQRSize, height: previewQRSize }}
                  >
                    {t.previewWord}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
