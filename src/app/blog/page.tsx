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

      {Object.entries(postsByCategory).map(([category, posts]) => (
        <div key={category} className="blog-category reveal active">
          <p className="blog-category-title">
            {CATEGORY_LABELS[category] ?? category}
          </p>
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
        </div>
      ))}
    </main>
  )
}