import { getPostsByCategory } from '@/lib/posts'
import { getDictionary } from '@/dictionaries'
import { getAlternates, pageTitle } from '@/lib/metadata'
import PageTitle from '@/components/PageTitle'
import PostList from '@/components/PostList'
import PostListItem from '@/components/PostListItem'
import Accordion from '@/components/Accordion'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
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

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const postsByCategory = getPostsByCategory()

  return (
    <main className="max-w-[900px] mx-auto px-6 py-12 md:px-8 md:py-16 relative z-10">
      <PageTitle>{dict.blog.pageTitle}</PageTitle>

      {Object.keys(postsByCategory).map((category) => (
        <Accordion
          key={category}
          title={dict.blog.categories[category] ?? category}
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
