import { getPostsByCategory } from '@/lib/posts'
import { getDictionary } from '@/dictionaries'
import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'
import PostList from '@/components/PostList'
import PostListItem from '@/components/PostListItem'
import Accordion from '@/components/Accordion'

export const metadata: Metadata = {
  title: 'Lecture Notes — Umut Yalçın Baki',
}

const CATEGORY_LABELS: Record<string, string> = {
  comp201: 'COMP 201 — Computer Systems and Programming',
  comp341: 'COMP 341 — Artificial Intelligence',
  econ499: 'ECON 499 — Economics Capstone',
  comp202: 'COMP 202 — Data Structures and Algorithms',
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const postsByCategory = getPostsByCategory()

  return (
    <main className="container">
      <PageTitle>{dict.blog.pageTitle}</PageTitle>

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
                href={`/${locale}/blog/${category}/${post.slug}`}
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
