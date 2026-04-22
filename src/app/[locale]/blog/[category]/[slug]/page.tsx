import { getAllPostParams, getPost } from '@/lib/posts'
import { getDictionary } from '@/dictionaries'
import { getAlternates, pageTitle } from '@/lib/metadata'
import TableOfContents from '@/components/TableOfContents'
import BackLink from '@/components/BackLink'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string; category: string; slug: string }>
}

export async function generateStaticParams() {
  return getAllPostParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, slug } = await params
  const post = await getPost(category, slug)
  return {
    title: pageTitle(post.title),
    description: post.description,
    alternates: getAlternates(locale, `/blog/${category}/${slug}`),
  }
}

export default async function PostPage({ params }: Props) {
  const { locale, category, slug } = await params
  const dict = getDictionary(locale)
  const post = await getPost(category, slug)

  return (
    <div className="flex justify-center gap-8 px-4 relative z-10">
      <aside className="hidden min-[1100px]:block flex-none w-[220px] self-stretch">
        <TableOfContents headings={post.headings} title={dict.post.onThisPage} />
      </aside>

      <main className="max-w-[800px] w-full py-8 flex-auto min-w-0 self-start">
        <BackLink href={`/${locale}/blog/${category}`} label={dict.post.backToCategory} />

        <article
          className="mt-8 markdown-body"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </main>
    </div>
  )
}
