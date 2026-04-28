import { getAllPostParams, getPost } from '@/lib/posts'
import { getDictionary } from '@/dictionaries'
import { getAlternates, pageTitle } from '@/lib/metadata'
import Sidebar from '@/components/Sidebar'
import SidebarDrawer from '@/components/SidebarDrawer'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string; path: string[] }>
}

export async function generateStaticParams() {
  return getAllPostParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, path } = await params
  const slug = path[path.length - 1]
  const category = path.slice(0, -1).join('/')
  const post = await getPost(category, slug)
  return {
    title: pageTitle(post.title),
    description: post.description,
    alternates: getAlternates(locale, `/blog/${path.join('/')}`),
  }
}

export default async function PostPage({ params }: Props) {
  const { locale, path } = await params
  const slug = path[path.length - 1]
  const categoryPath = path.slice(0, -1)
  const category = categoryPath.join('/')
  const dict = getDictionary(locale)
  const post = await getPost(category, slug)
  const backHref = category
    ? `/${locale}/blog?open=${encodeURIComponent(category)}&post=${encodeURIComponent(slug)}`
    : `/${locale}/blog`

  return (
    <div className="flex justify-center gap-8 px-4 relative z-10">
      <aside className="hidden min-[1100px]:block flex-none w-55 self-stretch">
        <Sidebar
          headings={post.headings}
          title={dict.post.sidebar}
          sidebarRoot={post.sidebarRoot}
          locale={locale}
          currentCategory={post.category}
          currentSlug={post.slug}
          relatedPostsLabel={dict.post.relatedPosts}
          backHref={backHref}
          backLabel={dict.post.backToCategory}
        />
      </aside>

      <main className="max-w-200 w-full py-8 flex-auto min-w-0 self-start">
        <SidebarDrawer
          headings={post.headings}
          title={dict.post.sidebar}
          backHref={backHref}
          backLabel={dict.post.backToCategory}
          sidebarRoot={post.sidebarRoot}
          locale={locale}
          currentCategory={post.category}
          currentSlug={post.slug}
          relatedPostsLabel={dict.post.relatedPosts}
        />

        <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </main>
    </div>
  )
}
