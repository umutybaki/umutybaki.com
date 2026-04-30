import { getDictionary } from '@/dictionaries'
import { getAlternates, pageTitle } from '@/lib/metadata'
import Timeline from '@/components/Timeline'
import Accordion from '@/components/Accordion'
import CvListSection from './CvListSection'
import { getCvData, technicalSkills } from './cvData'
import { GitHubIcon, LinkedInIcon } from '@/lib/icons'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale)
  return {
    title: pageTitle(dict.cv.pageTitle),
    description: dict.cv.pageDescription,
    alternates: getAlternates(locale, '/cv'),
  }
}

const tagStyle: Record<string, React.CSSProperties> = {
  lang: { backgroundColor: 'var(--accent-muted)', color: 'var(--accent-color)' },
  infra: { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  tool: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  spoken: { backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
}

export default async function CvPage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const { careerItems, educationItems, volunteeringItems, certificateItems, competitionItems } = getCvData(dict.cv)

  return (
    <main className="max-w-225 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section id="hero" className="mb-24 reveal active">
        <h1
          className="text-5xl font-bold tracking-tight mb-2 max-sm:text-4xl text-text-primary"
        >
          {dict.cv.name}
        </h1>

        <h2
          className="text-lg font-medium tracking-wide mb-6 max-sm:text-base text-accent-color font-roboto-mono"
        >
          {dict.cv.subtitle}
        </h2>

        <div className="max-w-xl leading-relaxed space-y-1 text-text-secondary">
          <p>{dict.cv.bio}</p>
        </div>

        {/* Contact links */}
        <div className="flex flex-wrap gap-5 mt-8">
          <a
            href="mailto:umut@baki.org.tr"
            className="flex items-center gap-2 text-sm no-underline transition-opacity duration-200 hover:opacity-70 text-text-primary"
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
            className="flex items-center gap-2 text-sm no-underline transition-opacity duration-200 hover:opacity-70 text-text-primary"
          >
            <LinkedInIcon size={18} />
            linkedin.com/in/umutybaki
          </a>
          <a
            href="https://github.com/umutybaki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm no-underline transition-opacity duration-200 hover:opacity-70 text-text-primary"
          >
            <GitHubIcon size={18} />
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
          className="text-3xl font-bold tracking-tight mb-8 text-text-primary"
        >
          {dict.cv.sections.career}
        </h2>
        <Timeline items={careerItems} />
      </section>

      {/* ── Education ───────────────────────────────────────── */}
      <section id="education" className="mb-24 reveal active">
        <h2
          className="text-3xl font-bold tracking-tight mb-8 text-text-primary"
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
