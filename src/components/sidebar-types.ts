import type { TocItem, CategoryNode } from '@/lib/posts'

export interface SidebarProps {
  headings: TocItem[]
  title: string
  sidebarRoot?: CategoryNode | null
  locale?: string
  currentCategory?: string
  currentSlug?: string
  relatedPostsLabel?: string
  backHref?: string
  backLabel?: string
}
