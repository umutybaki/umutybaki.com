import { getDictionary } from '@/dictionaries'
import { getAlternates } from '@/lib/metadata'
import SocialLink from '@/components/SocialLink'
import { GitHubIcon, LinkedInIcon } from '@/lib/icons'
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
    <main className="max-w-225 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <section className="flex flex-col justify-center h-[calc(100vh-70px)]">
        <h1 className="text-[2.75rem] md:text-[3.5rem] font-bold tracking-[-0.03em] text-text-primary">Umut Yalçın Baki</h1>
        <p className="text-[0.9rem] text-accent-color font-medium mb-4 font-roboto-mono tracking-[0.02em]">{dict.home.subtitle}</p>
        <p className="text-[1.1rem] text-text-secondary max-w-140 mb-0 leading-[1.7]">{dict.home.description}</p>

        <div className="flex gap-[0.6rem] flex-wrap mt-8">
          <SocialLink href="https://github.com/umutybaki" icon={<GitHubIcon />} label="GitHub" />
          <SocialLink href="https://www.linkedin.com/in/umutybaki" icon={<LinkedInIcon />} label="LinkedIn" />
        </div>
      </section>
    </main>
  )
}
