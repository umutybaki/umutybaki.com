import React from 'react'
import { Metadata } from 'next'
import Timeline from '@/components/Timeline'
import BackLink from '@/components/BackLink'
import { getDictionary } from '@/dictionaries'
import { era1, era2, era3, era4, era5, era6 } from './deBeersData'

export const metadata: Metadata = {
  title: 'De Beers: A Century of Diamonds & Antitrust',
  description: 'Interactive Timeline - ECON 499 Module 2, Antitrust Economics',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function GuidePage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const g = dict.guide

  const legendItems = [
    { label: g.legend.origins, color: '#7c3aed' },
    { label: g.legend.monopoly, color: '#0284c7' },
    { label: g.legend.legal, color: '#dc2626' },
    { label: g.legend.crises, color: '#ea580c' },
    { label: g.legend.strategy, color: '#059669' },
    { label: g.legend.law, color: '#2563eb' },
  ]

  return (
    <main className="max-w-225 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10 animate-fade-in">
      <div className="mb-10">
        <BackLink href={`/${locale}`} label={g.backToHome} />
      </div>

      <header className="text-center mb-10 pb-10 border-b border-card-border">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-text-primary">
          {g.title}
        </h1>
        <p className="text-sm font-roboto-mono tracking-wide text-text-secondary mb-3">
          {g.subtitle}
        </p>
        <p className="text-lg italic text-accent-color font-main">
          {g.tagline}
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-16 p-4 rounded-xl bg-surface-color border border-card-border shadow-sm">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-2 text-xs font-roboto-mono tracking-wide text-text-secondary">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>

      <div className="relative">
        <EraLabel label={g.eras.era1} />
        <Timeline items={era1} />

        <EraLabel label={g.eras.era2} />
        <Timeline items={era2} />

        <EraLabel label={g.eras.era3} />
        <Timeline items={era3} />

        <EraLabel label={g.eras.era4} />
        <Timeline items={era4} />

        <EraLabel label={g.eras.era5} />
        <Timeline items={era5} />

        <EraLabel label={g.eras.era6} />
        <Timeline items={era6} />
      </div>
    </main>
  )
}

function EraLabel({ label }: { label: string }) {
  return (
    <div className="flex justify-center my-12 relative z-10">
      <span className="inline-block bg-accent-color text-white text-[0.7rem] font-roboto-mono tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
        {label}
      </span>
    </div>
  )
}
