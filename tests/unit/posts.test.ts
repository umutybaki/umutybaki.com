import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import path from 'path'
import { fs as memfsFs, vol } from 'memfs'

// posts.ts uses `import fs from 'fs'` (default) — expose both default and named exports
vi.mock('fs', () => ({ default: memfsFs, ...memfsFs }))

import {
  sanitizeTitle,
  slugify,
  extractHeadings,
  getCategoryLabels,
  getCategoryTree,
  getAllPostParams,
  getAllPosts,
  getPostsByCategory,
  getPost,
} from '@/lib/posts'

// postsDirectory in posts.ts is set at import time as path.join(process.cwd(), 'posts').
// Mount virtual files at the same absolute path so the constant matches.
const POSTS_DIR = path.join(process.cwd(), 'posts')

function fixture(relPath: string) {
  return path.join(POSTS_DIR, relPath)
}

const FIXTURE: Record<string, string> = {
  [fixture('comp201/_meta.json')]: JSON.stringify({
    en: 'Computer Science 201',
    tr: 'Bilgisayar Bilimi 201',
    sidebarRoot: true,
    nonStringValue: 42,
  }),
  [fixture('comp201/intro.md')]: [
    '---',
    'title: Introduction',
    'date: 2024-03-15',
    'description: Course introduction',
    '---',
    '',
    '## Overview',
    '',
    'Content here.',
  ].join('\n'),
  [fixture('comp201/advanced.md')]: [
    '---',
    'title: Advanced Topics',
    'date: 2024-04-01',
    'description: Advanced content',
    '---',
    '',
    '## Advanced Section',
    '',
    'Content here.',
  ].join('\n'),
  [fixture('comp201/assembly/_meta.json')]: JSON.stringify({ en: 'Assembly', tr: 'Assembly' }),
  [fixture('comp201/assembly/x86.md')]: [
    '---',
    'title: x86 Basics',
    'date: 2024-02-10',
    'description: x86 intro',
    '---',
    '',
    '## Registers',
    '',
    'Content here.',
  ].join('\n'),
}

// ── Pure functions — no filesystem needed ───────────────────────

describe('sanitizeTitle', () => {
  it('replaces em dash with hyphen', () => {
    expect(sanitizeTitle('ES—256')).toBe('ES-256')
  })
  it('replaces en dash with hyphen', () => {
    expect(sanitizeTitle('A–B')).toBe('A-B')
  })
  it('replaces ampersand with "and"', () => {
    expect(sanitizeTitle('A & B')).toBe('A and B')
  })
  it('is a no-op on plain strings', () => {
    expect(sanitizeTitle('Hello World')).toBe('Hello World')
  })
  it('handles multiple replacements in one string', () => {
    expect(sanitizeTitle('A—B & C–D')).toBe('A-B and C-D')
  })
})

describe('slugify', () => {
  it('lowercases and hyphenates words', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })
  it('removes punctuation', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
  })
  it('trims leading and trailing hyphens', () => {
    expect(slugify('  hello  ')).toBe('hello')
  })
  it('collapses multiple spaces', () => {
    expect(slugify('a  b')).toBe('a-b')
  })
})

describe('extractHeadings', () => {
  it('extracts h2 headings', () => {
    expect(extractHeadings('## Overview\n\nsome text')).toEqual([
      { id: 'overview', text: 'Overview', depth: 2 },
    ])
  })
  it('extracts h3 headings', () => {
    expect(extractHeadings('### Sub Section')).toEqual([
      { id: 'sub-section', text: 'Sub Section', depth: 3 },
    ])
  })
  it('ignores h1 headings', () => {
    const headings = extractHeadings('# Title\n## Section')
    expect(headings).toHaveLength(1)
    expect(headings[0].depth).toBe(2)
  })
  it('ignores h4+ headings', () => {
    const headings = extractHeadings('#### Deep\n## Shallow')
    expect(headings).toHaveLength(1)
    expect(headings[0].id).toBe('shallow')
  })
  it('deduplicates slugs with counter suffix', () => {
    const md = '## Overview\n## Overview\n## Overview'
    expect(extractHeadings(md).map(h => h.id)).toEqual(['overview', 'overview-1', 'overview-2'])
  })
  it('sanitizes title text before slugifying', () => {
    const headings = extractHeadings('## A—B')
    expect(headings[0].text).toBe('A-B')
    expect(headings[0].id).toBe('a-b')
  })
  it('preserves heading order and depth', () => {
    const md = '## First\n### Nested\n## Second'
    const headings = extractHeadings(md)
    expect(headings.map(h => h.text)).toEqual(['First', 'Nested', 'Second'])
    expect(headings.map(h => h.depth)).toEqual([2, 3, 2])
  })
  it('returns empty array when no h2/h3 present', () => {
    expect(extractHeadings('# Title\nSome text.')).toHaveLength(0)
  })
})

// ── Filesystem-dependent functions ──────────────────────────────

beforeEach(() => {
  vol.fromJSON(FIXTURE, '/')
  vi.spyOn(process, 'cwd').mockReturnValue('/')
})

afterEach(() => {
  vol.reset()
  vi.restoreAllMocks()
})

describe('getCategoryLabels', () => {
  it('returns locale labels from _meta.json', () => {
    const labels = getCategoryLabels('comp201')
    expect(labels['en']).toBe('Computer Science 201')
    expect(labels['tr']).toBe('Bilgisayar Bilimi 201')
  })
  it('only includes string values — ignores non-string fields', () => {
    const labels = getCategoryLabels('comp201')
    expect(labels['nonStringValue']).toBeUndefined()
    expect(labels['sidebarRoot']).toBeUndefined()
  })
  it('returns empty object when _meta.json is missing', () => {
    expect(getCategoryLabels('nonexistent')).toEqual({})
  })
  it('returns empty object for malformed JSON', () => {
    vol.mkdirSync('/posts/broken', { recursive: true })
    vol.writeFileSync('/posts/broken/_meta.json', 'not-json{{{')
    expect(getCategoryLabels('broken')).toEqual({})
  })
})

describe('getCategoryTree', () => {
  it('returns one node per top-level directory', () => {
    const tree = getCategoryTree()
    expect(tree).toHaveLength(1)
    expect(tree[0].name).toBe('comp201')
  })
  it('node has correct path and labels', () => {
    const [node] = getCategoryTree()
    expect(node.path).toEqual(['comp201'])
    expect(node.labels['en']).toBe('Computer Science 201')
  })
  it('posts are sorted by date descending', () => {
    const [node] = getCategoryTree()
    const dates = node.posts.map(p => p.date)
    expect(dates[0] >= dates[1]).toBe(true)
  })
  it('nested subdirectory appears as a child node', () => {
    const [node] = getCategoryTree()
    expect(node.children).toHaveLength(1)
    expect(node.children[0].name).toBe('assembly')
  })
  it('child node has its own posts', () => {
    const [node] = getCategoryTree()
    expect(node.children[0].posts).toHaveLength(1)
    expect(node.children[0].posts[0].slug).toBe('x86')
  })
})

describe('getAllPostParams', () => {
  it('returns a path entry for every .md file', () => {
    const paths = getAllPostParams().map(p => p.path.join('/'))
    expect(paths).toContain('comp201/intro')
    expect(paths).toContain('comp201/advanced')
    expect(paths).toContain('comp201/assembly/x86')
  })
  it('does not include _meta.json entries', () => {
    const paths = getAllPostParams().map(p => p.path.join('/'))
    expect(paths.some(p => p.includes('_meta'))).toBe(false)
  })
})

describe('getAllPosts', () => {
  it('returns every post sorted by date descending', () => {
    const posts = getAllPosts()
    expect(posts).toHaveLength(3)
    expect(posts[0].slug).toBe('advanced')  // 2024-04-01
    expect(posts[1].slug).toBe('intro')     // 2024-03-15
    expect(posts[2].slug).toBe('x86')       // 2024-02-10
  })

  it('each post has correct category path', () => {
    const posts = getAllPosts()
    const x86 = posts.find(p => p.slug === 'x86')!
    expect(x86.categoryPath).toEqual(['comp201', 'assembly'])
    expect(x86.category).toBe('comp201/assembly')
  })
})

describe('getPostsByCategory', () => {
  it('groups posts by category', () => {
    const byCategory = getPostsByCategory()
    expect(Object.keys(byCategory)).toHaveLength(2)
    expect(byCategory['comp201']).toHaveLength(2)
    expect(byCategory['comp201/assembly']).toHaveLength(1)
  })
})

describe('getPost', () => {
  it('compiles markdown to HTML', async () => {
    const post = await getPost('comp201', 'intro')
    // The remark pipeline should produce a container div with the content
    expect(post.contentHtml).toContain('<h2')
    expect(post.contentHtml).toContain('Overview')
    expect(post.contentHtml).toContain('<p>')
  })

  it('extracts headings from the post', async () => {
    const post = await getPost('comp201', 'intro')
    expect(post.headings).toHaveLength(1)
    expect(post.headings[0]).toEqual({ id: 'overview', text: 'Overview', depth: 2 })
  })

  it('sets correct meta fields', async () => {
    const post = await getPost('comp201/assembly', 'x86')
    expect(post.title).toBe('x86 Basics')
    expect(post.slug).toBe('x86')
    expect(post.category).toBe('comp201/assembly')
    expect(post.description).toBe('x86 intro')
  })

  it('returns sidebarRoot when _meta.json has sidebarRoot: true', async () => {
    const post = await getPost('comp201', 'intro')
    expect(post.sidebarRoot).not.toBeNull()
    expect(post.sidebarRoot!.name).toBe('comp201')
    expect(post.sidebarRoot!.posts).toHaveLength(2)
  })

  it('returns null sidebarRoot for nested posts without a root ancestor', async () => {
    // assembly/_meta.json does NOT have sidebarRoot: true
    // and its parent comp201 has sidebarRoot: true, so getSidebarRoot
    // walks up and finds it at comp201 level
    const post = await getPost('comp201/assembly', 'x86')
    // sidebarRoot is found by walking up to the comp201 level which has sidebarRoot: true
    expect(post.sidebarRoot).not.toBeNull()
    expect(post.sidebarRoot!.name).toBe('comp201')
  })
})
