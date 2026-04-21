import type { Metadata } from 'next'
import { getDictionary } from '@/dictionaries'
import Timeline from '@/components/Timeline'
import Accordion from '@/components/Accordion'
import CvListSection from './CvListSection'
import { getCvData, technicalSkills } from './cvData'

export const metadata: Metadata = {
  title: 'CV – Umut Yalçın Baki',
  description:
    'Portfolio of Umut Yalçın Baki, Software Engineer & Computer Engineering/Economics double major at Koç University.',
}

const tagStyle: Record<string, React.CSSProperties> = {
  lang: { backgroundColor: 'var(--accent-muted)', color: 'var(--accent-color)' },
  infra: { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  tool: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  spoken: { backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function CvPage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const { careerItems, educationItems, volunteeringItems, certificateItems, competitionItems } = getCvData(dict.cv)

  return (
    <main className="max-w-(--max-width) mx-auto px-8 py-16 relative z-1">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section id="hero" className="mb-24 reveal active">
        <h1
          className="text-5xl font-bold tracking-tight mb-2 max-sm:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          {dict.cv.name}
        </h1>

        <h2
          className="text-lg font-medium tracking-wide mb-6 max-sm:text-base"
          style={{ color: 'var(--accent-color)', fontFamily: 'var(--font-roboto-mono), monospace' }}
        >
          {dict.cv.subtitle}
        </h2>

        <div className="max-w-xl leading-relaxed space-y-1" style={{ color: 'var(--text-secondary)' }}>
          <p>{dict.cv.bio}</p>
        </div>

        {/* Contact links */}
        <div className="flex flex-wrap gap-5 mt-8">
          <a
            href="mailto:umut@baki.org.tr"
            className="flex items-center gap-2 text-sm no-underline transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            umut@baki.org.tr
          </a>
          <a
            href="https://www.linkedin.com/in/umutybaki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm no-underline transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            linkedin.com/in/umutybaki
          </a>
          <a
            href="https://github.com/umutybaki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm no-underline transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            github.com/umutybaki
          </a>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-10">
          {technicalSkills.map((skill) => (
            <span
              key={skill.label}
              className="text-xs font-medium px-3 py-1.5 rounded-full tracking-wide"
              style={tagStyle[skill.category] ?? tagStyle.lang}
            >
              {skill.label}
            </span>
          ))}
        </div>

        {/* Spoken languages */}
        <div className="flex flex-wrap gap-2 mt-4">
          {dict.cv.spokenLanguages.map((lang) => (
            <span
              key={lang}
              className="text-xs font-medium px-3 py-1.5 rounded-full tracking-wide"
              style={tagStyle.spoken}
            >
              {lang}
            </span>
          ))}
        </div>
      </section>

      {/* ── Career ──────────────────────────────────────────── */}
      <section id="experience" className="mb-24 reveal active">
        <h2
          className="text-3xl font-bold tracking-tight mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          {dict.cv.sections.career}
        </h2>
        <Timeline items={careerItems} />
      </section>

      {/* ── Education ───────────────────────────────────────── */}
      <section id="education" className="mb-24 reveal active">
        <h2
          className="text-3xl font-bold tracking-tight mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          {dict.cv.sections.education}
        </h2>
        <Timeline items={educationItems} />
      </section>

      {/* ── Volunteering ────────────────────────────────────── */}
      <Accordion
        titleClassName="text-3xl font-bold tracking-tight"
        title={dict.cv.sections.volunteering}
        defaultOpen
      >
        <CvListSection items={volunteeringItems} />
      </Accordion>

      {/* ── Certificates ────────────────────────────────────── */}
      <Accordion
        titleClassName="text-3xl font-bold tracking-tight"
        title={dict.cv.sections.certificates}
      >
        <CvListSection items={certificateItems} />
      </Accordion>

      {/* ── Competitions ────────────────────────────────────── */}
      <Accordion
        titleClassName="text-3xl font-bold tracking-tight"
        title={dict.cv.sections.competitions}
      >
        <CvListSection items={competitionItems} />
      </Accordion>
    </main>
  )
}
