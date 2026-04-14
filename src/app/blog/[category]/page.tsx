import Link from 'next/link'
import { getPostsByCategory } from '@/lib/posts'
import type { Metadata } from 'next'

const CATEGORY_LABELS: Record<string, string> = {
  comp201: 'COMP 201 — Computer Systems & Programming',
  comp341: 'COMP 341 — Artificial Intelligence',
  econ499: 'ECON 499 — Economics Capstone',
}

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const postsByCategory = getPostsByCategory()
  return Object.keys(postsByCategory).map((category) => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const label = CATEGORY_LABELS[category] ?? category
  return {
    title: `${label} — Umut Yalçın Baki`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const postsByCategory = getPostsByCategory()
  const posts = postsByCategory[category] ?? []
  const label = CATEGORY_LABELS[category] ?? category

  return (
    <main className="container">
      <Link href="/blog" className="back-link">
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
        All Categories
      </Link>

      <h1 className="section-title reveal active">{label}</h1>

      <ul className="blog-post-list">
        {posts.map((post) => (
          <li key={post.slug} className="blog-post-item">
            <Link
              href={`/blog/${category}/${post.slug}`}
              className="blog-post-link"
            >
              <span className="blog-post-title">{post.title}</span>
              {post.date && (
                <span className="blog-post-date">{post.date}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
