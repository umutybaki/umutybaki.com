import { getPostsByCategory } from '@/lib/posts'
import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'
import PostList from '@/components/PostList'
import PostListItem from '@/components/PostListItem'
import Accordion from '@/components/Accordion'

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
      <PageTitle>Lecture Notes</PageTitle>

      {Object.keys(postsByCategory).map((category) => (
        <Accordion
          key={category}
          title={CATEGORY_LABELS[category] ?? category}
          defaultOpen
        >
          <PostList>
            {postsByCategory[category].map((post) => (
              <PostListItem
                key={post.slug}
                href={`/blog/${category}/${post.slug}`}
                title={post.title}
                meta={post.date}
              />
            ))}
          </PostList>
        </Accordion>
      ))}
    </main>
  )
}
