import { getCategoryTree } from '@/lib/posts'
import { getDictionary } from '@/dictionaries'
import { getAlternates, pageTitle } from '@/lib/metadata'
import PageTitle from '@/components/PageTitle'
import TreeAccordion from '@/components/TreeAccordion'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ open?: string; post?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale)
  return {
    title: pageTitle(dict.blog.pageTitle),
    description: dict.blog.pageTitle,
    alternates: getAlternates(locale, '/blog'),
  }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { open, post } = await searchParams
  const dict = getDictionary(locale)
  const tree = getCategoryTree()

  return (
    <main className="max-w-225 mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <PageTitle>{dict.blog.pageTitle}</PageTitle>
      <TreeAccordion nodes={tree} locale={locale} openPath={open} activePost={post} />
    </main>
  )
}
