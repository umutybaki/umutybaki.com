import { getAllPostParams, getPost } from '@/lib/posts'
import type { Metadata } from 'next'
import Link from 'next/link'
import MarkdownTheme from '@/components/MarkdownTheme'
import TableOfContents from '@/components/TableOfContents'

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
        <Link href={`/blog/${category}`} className="back-link">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Category
        </Link>

        <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </main>
    </div>
  )
}