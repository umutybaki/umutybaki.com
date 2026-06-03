'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PDFDocument } from 'pdf-lib'

type PdfEntry = {
  id: string
  name: string
  pageCount: number
  bytes: ArrayBuffer
}

type PagesPerSide = 1 | 2 | 4 | 9

const PAGES_PER_SIDE: PagesPerSide[] = [1, 2, 4, 9]

function paddedCount(n: number, multiple: number): number {
  if (multiple <= 1) return n
  const rem = n % multiple
  return rem === 0 ? n : n + (multiple - rem)
}

type AppDict = {
  back: string
  title: string
  subtitle: string
  dropZone: string
  pagesPerSide: string
  sides: string
  singleSided: string
  doubleSided: string
  noPadding: string
  paddingNote: (n: number) => string
  paddingDesc: Record<string, string>
  page: string
  pages: string
  blank: string
  file: string
  files: string
  total: string
  merge: string
  merging: string
}

const dict: Record<'en' | 'tr', AppDict> = {
  en: {
    back: 'Tools',
    title: 'PDF Merger',
    subtitle: 'Merge multiple PDFs into one. Add blank pages so each document starts on a fresh sheet when printing.',
    dropZone: 'Drop PDF files here or click to select',
    pagesPerSide: 'Pages per side',
    sides: 'Print mode',
    singleSided: 'Single-sided',
    doubleSided: 'Double-sided',
    noPadding: 'No padding — documents are merged as-is',
    paddingNote: n => `→ Padding each document to a multiple of ${n} pages`,
    paddingDesc: {
      '1-single': 'Every count is a multiple of 1 — no blank pages added',
      '1-double': 'Standard duplex — each document ends on a back side',
      '2-single': '2 pages per sheet, single-sided',
      '2-double': '2-up duplex — 4 pages per sheet (front + back)',
      '4-single': '4 pages per sheet, single-sided',
      '4-double': '4-up duplex — 8 pages per sheet (front + back)',
      '9-single': '9 pages per sheet, single-sided',
      '9-double': '9-up duplex — 18 pages per sheet (front + back)',
    },
    page: 'page',
    pages: 'pages',
    blank: 'blank',
    file: 'file',
    files: 'files',
    total: 'total',
    merge: 'Merge & Download PDF',
    merging: 'Merging…',
  },
  tr: {
    back: 'Araçlar',
    title: 'PDF Birleştirici',
    subtitle: "Birden fazla PDF'i tek dosyada birleştirin. Baskıda her belgenin temiz bir sayfadan başlaması için boş sayfa ekleyin.",
    dropZone: 'PDF dosyalarını buraya bırakın veya seçmek için tıklayın',
    pagesPerSide: 'Yüz başına sayfa',
    sides: 'Baskı modu',
    singleSided: 'Tek yüz',
    doubleSided: 'Çift yüz (dupleks)',
    noPadding: 'Doldurum yok — belgeler olduğu gibi birleştirilir',
    paddingNote: n => `→ Her belge ${n} sayfanın katına tamamlanıyor`,
    paddingDesc: {
      '1-single': "Her sayı 1'in katıdır — boş sayfa eklenmez",
      '1-double': 'Standart dupleks — her belge arka yüzde biter',
      '2-single': 'Sayfada 2 sayfa, tek yüz',
      '2-double': "2'li dupleks — sayfada 4 sayfa (ön ve arka)",
      '4-single': 'Sayfada 4 sayfa, tek yüz',
      '4-double': "4'lü dupleks — sayfada 8 sayfa (ön ve arka)",
      '9-single': 'Sayfada 9 sayfa, tek yüz',
      '9-double': "9'lu dupleks — sayfada 18 sayfa (ön ve arka)",
    },
    page: 'sayfa',
    pages: 'sayfa',
    blank: 'boş',
    file: 'dosya',
    files: 'dosya',
    total: 'toplam',
    merge: 'Birleştir ve PDF İndir',
    merging: 'Birleştiriliyor…',
  },
}

const btnBase = 'px-2.5 py-1 rounded text-[0.8rem] font-roboto-mono border transition-colors duration-150'
const btnActive = 'border-accent-color text-accent-color'
const btnIdle = 'border-border-color text-text-secondary hover:text-text-primary hover:border-[var(--accent-hover-border)]'

export default function PdfMergerPage() {
  const params = useParams()
  const locale = (params.locale as string) === 'tr' ? 'tr' : 'en'
  const t = dict[locale]

  const [entries, setEntries] = useState<PdfEntry[]>([])
  const [pagesPerSide, setPagesPerSide] = useState<PagesPerSide | null>(null)
  const [doubleSided, setDoubleSided] = useState(true)
  const [merging, setMerging] = useState(false)
  const [dropZoneOver, setDropZoneOver] = useState(false)
  const [dragSrcId, setDragSrcId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const multiplier = pagesPerSide === null ? 0 : pagesPerSide * (doubleSided ? 2 : 1)

  async function loadFiles(fileList: FileList | File[]) {
    const newEntries: PdfEntry[] = []
    for (const file of Array.from(fileList)) {
      if (!file.name.toLowerCase().endsWith('.pdf')) continue
      try {
        const bytes = await file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        newEntries.push({
          id: crypto.randomUUID(),
          name: file.name,
          pageCount: doc.getPageCount(),
          bytes,
        })
      } catch {
        // skip corrupted files silently
      }
    }
    if (newEntries.length > 0) setEntries(prev => [...prev, ...newEntries])
  }

  function handleDropZoneDrop(e: React.DragEvent) {
    e.preventDefault()
    setDropZoneOver(false)
    loadFiles(e.dataTransfer.files)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) loadFiles(e.target.files)
    e.target.value = ''
  }

  function handleItemDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    e.stopPropagation()
    if (dragSrcId !== id) setDragOverId(id)
  }

  function handleItemDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    e.stopPropagation()
    if (dragSrcId && dragSrcId !== targetId) {
      setEntries(prev => {
        const next = [...prev]
        const srcIdx = next.findIndex(x => x.id === dragSrcId)
        const tgtIdx = next.findIndex(x => x.id === targetId)
        const [removed] = next.splice(srcIdx, 1)
        next.splice(tgtIdx, 0, removed)
        return next
      })
    }
    setDragSrcId(null)
    setDragOverId(null)
  }

  function moveUp(index: number) {
    if (index === 0) return
    setEntries(prev => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  function moveDown(index: number) {
    setEntries(prev => {
      if (index === prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  function removeEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function selectPagesPerSide(p: PagesPerSide) {
    if (pagesPerSide === p) {
      setPagesPerSide(null)
    } else {
      setPagesPerSide(p)
      setDoubleSided(true)
    }
  }

  const merge = useCallback(async () => {
    if (entries.length === 0 || merging) return
    setMerging(true)
    try {
      const merged = await PDFDocument.create()
      for (const entry of entries) {
        const doc = await PDFDocument.load(entry.bytes)
        const indices = doc.getPageIndices()
        const copied = await merged.copyPages(doc, indices)
        copied.forEach(p => merged.addPage(p))
        if (multiplier > 1) {
          const blanks = paddedCount(entry.pageCount, multiplier) - entry.pageCount
          if (blanks > 0) {
            const lastPage = doc.getPage(indices[indices.length - 1])
            const { width, height } = lastPage.getSize()
            for (let i = 0; i < blanks; i++) merged.addPage([width, height])
          }
        }
      }
      const bytes = await merged.save()
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setMerging(false)
    }
  }, [entries, multiplier, merging])

  const totalPages = entries.reduce(
    (sum, e) => sum + (multiplier > 1 ? paddedCount(e.pageCount, multiplier) : e.pageCount),
    0,
  )

  const paddingKey = pagesPerSide !== null ? `${pagesPerSide}-${doubleSided ? 'double' : 'single'}` : null
  const pageStr = (n: number) => `${n} ${n === 1 ? t.page : t.pages}`

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

      <div className="flex flex-col gap-8">

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDropZoneOver(true) }}
          onDragLeave={e => { e.preventDefault(); setDropZoneOver(false) }}
          onDrop={handleDropZoneDrop}
          className={[
            'relative flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-lg border-2 border-dashed cursor-pointer select-none transition-colors duration-150',
            dropZoneOver
              ? 'border-accent-color bg-surface-hover'
              : 'border-border-color hover:border-[var(--accent-hover-border)] hover:bg-surface-hover',
          ].join(' ')}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <span className="text-[0.9rem] text-text-secondary font-roboto-mono text-center">
            {t.dropZone}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {/* File list */}
        {entries.length > 0 && (
          <ul className="flex flex-col border border-border-color rounded-lg overflow-hidden">
            {entries.map((entry, i) => {
              const padded = multiplier > 1 ? paddedCount(entry.pageCount, multiplier) : entry.pageCount
              const blanks = padded - entry.pageCount
              const isDragging = dragSrcId === entry.id
              const isDropTarget = dragOverId === entry.id && !isDragging
              return (
                <li
                  key={entry.id}
                  draggable
                  onDragStart={() => setDragSrcId(entry.id)}
                  onDragOver={e => handleItemDragOver(e, entry.id)}
                  onDragLeave={() => setDragOverId(null)}
                  onDrop={e => handleItemDrop(e, entry.id)}
                  onDragEnd={() => { setDragSrcId(null); setDragOverId(null) }}
                  className={[
                    'flex items-center gap-3 px-4 py-3 border-b border-border-color last:border-b-0 transition-colors duration-75 select-none',
                    isDragging ? 'opacity-40 bg-surface-hover' :
                    isDropTarget ? 'bg-surface-hover shadow-[inset_0_2px_0_0_var(--accent-color)]' :
                    'bg-surface-color hover:bg-surface-hover',
                  ].join(' ')}
                >
                  {/* Drag handle */}
                  <div className="cursor-grab active:cursor-grabbing text-text-secondary hover:text-text-primary flex-none opacity-40 hover:opacity-100 transition-opacity duration-100">
                    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                      <circle cx="3" cy="2.5" r="1.2" />
                      <circle cx="7" cy="2.5" r="1.2" />
                      <circle cx="3" cy="7" r="1.2" />
                      <circle cx="7" cy="7" r="1.2" />
                      <circle cx="3" cy="11.5" r="1.2" />
                      <circle cx="7" cy="11.5" r="1.2" />
                    </svg>
                  </div>

                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary flex-none">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>

                  <span
                    className="flex-1 min-w-0 truncate text-[0.875rem] font-roboto-mono text-text-primary"
                    title={entry.name}
                  >
                    {entry.name}
                  </span>

                  <div className="flex items-center gap-1.5 flex-none text-[0.8rem] font-roboto-mono whitespace-nowrap">
                    <span className="text-text-secondary">{pageStr(entry.pageCount)}</span>
                    {blanks > 0 && (
                      <>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className="text-accent-color">{pageStr(padded)}</span>
                        <span className="text-text-secondary opacity-60">(+{blanks}&nbsp;{t.blank})</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 flex-none">
                    <button
                      onClick={() => moveUp(i)}
                      disabled={i === 0}
                      className="p-1 rounded text-text-secondary hover:text-text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-100"
                      aria-label="Move up"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveDown(i)}
                      disabled={i === entries.length - 1}
                      className="p-1 rounded text-text-secondary hover:text-text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-100"
                      aria-label="Move down"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="p-1 rounded text-text-secondary hover:text-red-500 transition-colors duration-100 ml-0.5"
                      aria-label="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/* Print layout */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[0.8rem] text-text-secondary font-roboto-mono">{t.pagesPerSide}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setPagesPerSide(null)}
                className={`${btnBase} ${pagesPerSide === null ? btnActive : btnIdle}`}
              >
                0
              </button>
              {PAGES_PER_SIDE.map(p => (
                <button
                  key={p}
                  onClick={() => selectPagesPerSide(p)}
                  className={`${btnBase} ${pagesPerSide === p ? btnActive : btnIdle}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {pagesPerSide !== null && (
            <div className="flex flex-col gap-2">
              <span className="text-[0.8rem] text-text-secondary font-roboto-mono">{t.sides}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setDoubleSided(false)}
                  className={`${btnBase} ${!doubleSided ? btnActive : btnIdle}`}
                >
                  {t.singleSided}
                </button>
                <button
                  onClick={() => setDoubleSided(true)}
                  className={`${btnBase} ${doubleSided ? btnActive : btnIdle}`}
                >
                  {t.doubleSided}
                </button>
              </div>
            </div>
          )}

          <div className="min-h-[2.5rem]">
            {paddingKey ? (
              <div className="flex flex-col gap-0.5">
                <p className="text-[0.85rem] text-accent-color font-roboto-mono">
                  {t.paddingNote(multiplier)}
                </p>
                <p className="text-[0.8rem] text-text-secondary">
                  {t.paddingDesc[paddingKey]}
                </p>
              </div>
            ) : (
              <p className="text-[0.85rem] text-text-secondary font-roboto-mono">{t.noPadding}</p>
            )}
          </div>
        </div>

        {/* Summary + action */}
        <div className="flex flex-col gap-3">
          {entries.length > 0 && (
            <p className="text-[0.85rem] text-text-secondary font-roboto-mono">
              {entries.length}&nbsp;{entries.length === 1 ? t.file : t.files}&nbsp;·&nbsp;{pageStr(totalPages)}&nbsp;{t.total}
            </p>
          )}
          <button
            onClick={merge}
            disabled={entries.length === 0 || merging}
            className="px-5 py-2.5 rounded-md border border-border-color text-[0.95rem] font-[500] text-text-primary transition-all duration-150 hover:bg-surface-hover hover:border-[var(--accent-hover-border)] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-border-color self-start"
          >
            {merging ? t.merging : t.merge}
          </button>
        </div>

      </div>
    </main>
  )
}
