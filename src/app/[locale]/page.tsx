import { getDictionary } from '@/dictionaries'
import { getAlternates } from '@/lib/metadata'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale)
  return {
    title: 'Umut Yalçın Baki',
    description: dict.home.description,
    alternates: getAlternates(locale, ''),
  }
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)

  return (
    <main className="max-w-[900px] mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <section className="flex flex-col justify-center h-[calc(100vh-70px)]">
        <h1 className="text-[2.75rem] md:text-[3.5rem] font-bold tracking-[-0.03em] text-text-primary">Umut Yalçın Baki</h1>
        <p className="text-[0.9rem] text-accent-color font-medium mb-4 font-roboto-mono tracking-[0.02em]">{dict.home.subtitle}</p>
        <p className="text-[1.1rem] text-text-secondary max-w-[560px] mb-0 leading-[1.7]">{dict.home.description}</p>

        <div className="flex gap-[0.6rem] flex-wrap mt-8">
          <a
            href="https://github.com/umutybaki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[0.45rem] px-4 py-[0.6rem] border border-border-color rounded-sm text-text-primary font-[450] text-[0.9rem] transition-colors duration-150 no-underline hover:bg-surface-hover hover:border-[rgba(255,100,0,0.3)] hover:opacity-100 [&_svg]:text-accent-color"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/umutybaki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[0.45rem] px-4 py-[0.6rem] border border-border-color rounded-sm text-text-primary font-[450] text-[0.9rem] transition-colors duration-150 no-underline hover:bg-surface-hover hover:border-[rgba(255,100,0,0.3)] hover:opacity-100 [&_svg]:text-accent-color"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </a>
        </div>
      </section>
    </main>
  )
}
