'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { CategoryNode, PostMeta } from '@/lib/posts'

function PostRow({ post, locale, currentCategory, currentSlug, depth }: {
  post: PostMeta
  locale: string
  currentCategory: string
  currentSlug: string
  depth: number
}) {
  const isCurrent = post.slug === currentSlug && post.category === currentCategory
  const indent = (depth + 1) * 10

  return (
    <Link
      href={`/${locale}/blog/${post.categoryPath.join('/')}/${post.slug}`}
      style={{ paddingLeft: `${indent}px` }}
      className="flex items-center h-8 pr-3 no-underline hover:bg-surface-hover rounded-sm transition-colors duration-150 group"
    >
      <span className={`text-[0.78rem] truncate transition-colors duration-150 group-hover:text-accent-color ${isCurrent ? 'text-accent-color underline underline-offset-2' : 'text-text-primary'}`}>
        {post.title}
      </span>
    </Link>
  )
}

function TreeNode({ node, locale, currentCategory, currentSlug, depth }: {
  node: CategoryNode
  locale: string
  currentCategory: string
  currentSlug: string
  depth: number
}) {
  const nodePathStr = node.path.join('/')
  const containsCurrent =
    currentCategory === nodePathStr || currentCategory.startsWith(nodePathStr + '/')
  const [open, setOpen] = useState(containsCurrent)
  const label = node.labels[locale] ?? node.labels['en'] ?? node.name
  const indent = depth * 14

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{ paddingLeft: `${indent}px` }}
        className="w-full flex items-center gap-1.5 h-8 pr-3 text-left bg-transparent border-none cursor-pointer hover:bg-surface-hover rounded-sm transition-colors duration-150"
      >
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`text-text-secondary shrink-0 transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-accent-color shrink-0"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-[0.78rem] text-text-primary font-medium truncate">{label}</span>
      </button>

      <div className={`grid transition-[grid-template-rows] duration-200 ease-in ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div style={{ borderLeft: '1px solid var(--border-color)', marginLeft: `${indent + 5}px` }}>
            {node.posts.map((post) => (
              <PostRow
                key={post.slug}
                post={post}
                locale={locale}
                currentCategory={currentCategory}
                currentSlug={currentSlug}
                depth={depth}
              />
            ))}
            {node.children.map((child) => (
              <TreeNode
                key={child.name}
                node={child}
                locale={locale}
                currentCategory={currentCategory}
                currentSlug={currentSlug}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  root: CategoryNode
  locale: string
  currentCategory: string
  currentSlug: string
  relatedPostsLabel?: string
}

export default function SidebarTree({ root, locale, currentCategory, currentSlug, relatedPostsLabel }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-1.5 px-1 mb-1 text-left bg-transparent border-none cursor-pointer group"
      >
        <svg
          width="9" height="9" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`text-accent-color shrink-0 transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-[0.7rem] text-accent-color font-semibold uppercase tracking-[0.06em] group-hover:opacity-80 transition-opacity duration-150">
          {relatedPostsLabel ?? 'Related Posts'}
        </span>
      </button>

      <div className={`grid transition-[grid-template-rows] duration-200 ease-in ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          {root.posts.map((post) => (
            <PostRow
              key={post.slug}
              post={post}
              locale={locale}
              currentCategory={currentCategory}
              currentSlug={currentSlug}
              depth={-1}
            />
          ))}
          {root.children.map((child) => (
            <TreeNode
              key={child.name}
              node={child}
              locale={locale}
              currentCategory={currentCategory}
              currentSlug={currentSlug}
              depth={0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}