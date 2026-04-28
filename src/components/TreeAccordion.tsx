'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { CategoryNode, PostMeta } from '@/lib/posts'

interface TreeAccordionProps {
  nodes: CategoryNode[]
  locale: string
  depth?: number
  openPath?: string
  activePost?: string
}

function PostRow({ post, locale, depth, isActive }: { post: PostMeta; locale: string; depth: number; isActive?: boolean }) {
  const href = `/${locale}/blog/${post.category}/${post.slug}`
  const indent = (depth + 1) * 16

  return (
    <li>
      <Link
        href={href}
        style={{ paddingLeft: `${indent}px` }}
        className="flex justify-between items-center h-9 pr-4 no-underline hover:bg-surface-hover rounded-sm transition-colors duration-150 group"
      >
        <span className={`text-sm text-text-primary whitespace-nowrap group-hover:text-accent-color transition-colors duration-150 ${isActive ? 'underline underline-offset-2' : ''}`}>
          {post.title}
        </span>
        {post.date && (
          <span className="font-medium text-xs text-text-secondary whitespace-nowrap ml-4 shrink-0">
            {post.date.slice(0, 7)}
          </span>
        )}
      </Link>
    </li>
  )
}

function TreeNode({
  node,
  locale,
  depth,
  openPath,
  activePost,
}: {
  node: CategoryNode
  locale: string
  depth: number
  openPath?: string
  activePost?: string
}) {
  const openSegments = openPath ? openPath.split('/') : []
  const isOnOpenPath =
    openSegments.length >= node.path.length &&
    node.path.every((seg, i) => seg === openSegments[i])
  const [isOpen, setIsOpen] = useState(isOnOpenPath)
  const indent = depth * 16
  const label = node.labels[locale] ?? node.labels['en'] ?? node.name

  return (
    <div>
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-expanded={isOpen}
        style={{ paddingLeft: `${indent}px` }}
        className="w-full flex items-center gap-2 h-9 pr-4 text-left bg-transparent border-none cursor-pointer hover:bg-surface-hover rounded-sm transition-colors duration-150"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-text-secondary shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-color shrink-0"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <span
          className={
            depth === 0
              ? 'text-sm text-accent-color font-semibold uppercase tracking-[0.06em]'
              : 'text-sm text-text-primary font-medium'
          }
        >
          {label}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {depth > 0 ? (
            <div
              style={{
                borderLeft: '1px solid var(--border-color)',
                marginLeft: `${indent + 6}px`,
              }}
            >
              <ul className="list-none">
                {node.posts.map((post) => (
                  <PostRow key={post.slug} post={post} locale={locale} depth={depth} isActive={post.slug === activePost} />
                ))}
              </ul>
              {node.children.length > 0 && (
                <TreeAccordion nodes={node.children} locale={locale} depth={depth + 1} openPath={openPath} activePost={activePost} />
              )}
            </div>
          ) : (
            <>
              <ul className="list-none">
                {node.posts.map((post) => (
                  <PostRow key={post.slug} post={post} locale={locale} depth={depth} isActive={post.slug === activePost} />
                ))}
              </ul>
              {node.children.length > 0 && (
                <TreeAccordion nodes={node.children} locale={locale} depth={depth + 1} openPath={openPath} activePost={activePost} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TreeAccordion({ nodes, locale, depth = 0, openPath, activePost }: TreeAccordionProps) {
  const inner = (
    <div className={`min-w-max ${depth === 0 ? 'flex flex-col gap-1' : ''}`}>
      {nodes.map((node) => (
        <TreeNode key={node.path.join('/')} node={node} locale={locale} depth={depth} openPath={openPath} activePost={activePost} />
      ))}
    </div>
  )

  if (depth === 0) {
    return <div className="overflow-x-auto">{inner}</div>
  }

  return inner
}
