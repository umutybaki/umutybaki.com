import Link from 'next/link'
import { getPostsByCategory } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lecture Notes — Umut Yalçın Baki',
}

const CATEGORY_LABELS: Record<string, string> = {
  comp201: 'COMP 201 — Computer Systems & Programming',
  comp341: 'COMP 341 — Artificial Intelligence',
  econ499: 'ECON 499 — Economics Capstone',
}

export default function BlogPage() {
  const postsByCategory = getPostsByCategory()

  return (
    <main className="container">
      <h1 className="section-title reveal active">Lecture Notes</h1>

      <ul className="blog-post-list">
        {Object.keys(postsByCategory).map((category) => (
          <li key={category} className="blog-post-item">
            <Link href={`/blog/${category}`} className="blog-post-link">
              <span className="blog-post-title">
                {CATEGORY_LABELS[category] ?? category}
              </span>
              <span className="blog-post-date">
                {postsByCategory[category].length} notes
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}