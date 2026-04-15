import { getAllPostParams, getPost } from '@/lib/posts'
import type { Metadata } from 'next'
import MarkdownTheme from '@/components/MarkdownTheme'
import TableOfContents from '@/components/TableOfContents'
import BackLink from '@/components/BackLink'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  return getAllPostParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const post = await getPost(category, slug)
  return {
    title: `${post.title} — Umut Yalçın Baki`,
    description: post.description,
  }
}

export default async function PostPage({ params }: Props) {
  const { category, slug } = await params
  const post = await getPost(category, slug)

  return (
    <div className="blog-page">
      <MarkdownTheme />
      <aside className="blog-toc-sidebar">
        <TableOfContents headings={post.headings} />
      </aside>

      <main className="blog-container">
        <BackLink href={`/blog/${category}`} label="Back to Category" />

        <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </main>
    </div>
  )
}