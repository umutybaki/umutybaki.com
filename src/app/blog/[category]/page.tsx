import { getPostsByCategory } from '@/lib/posts'
import type { Metadata } from 'next'
import BackLink from '@/components/BackLink'
import PageTitle from '@/components/PageTitle'
import PostList from '@/components/PostList'
import PostListItem from '@/components/PostListItem'

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
      <BackLink href="/blog" label="All Categories" />

      <PageTitle>{label}</PageTitle>

      <PostList>
        {posts.map((post) => (
          <PostListItem
            key={post.slug}
            href={`/blog/${category}/${post.slug}`}
            title={post.title}
            meta={post.date}
          />
        ))}
      </PostList>
    </main>
  )
}