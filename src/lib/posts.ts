import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface TocItem {
  id: string
  text: string
  depth: number
}

export interface PostMeta {
  slug: string
  category: string       // categoryPath.join('/') — e.g. 'comp201' or 'comp201/assembly'
  categoryPath: string[] // e.g. ['comp201'] or ['comp201', 'assembly']
  title: string
  date: string
  description: string
}

export interface Post extends PostMeta {
  contentHtml: string
  headings: TocItem[]
  sidebarRoot: CategoryNode | null
}

export interface CategoryNode {
  name: string                    // folder name at this level
  path: string[]                  // full path from posts root
  labels: Record<string, string>  // locale → title from _meta.json, e.g. { en: '...', tr: '...' }
  posts: PostMeta[]               // .md files directly in this directory
  children: CategoryNode[]
}

export function sanitizeTitle(title: string): string {
  return title
    .replace(/[—–]/g, '-')
    .replace(/&/g, 'and')
}

export function normalizeSlug(raw: string): string {
  return raw
    .replace(/ /g, '_')
    .replace(/[^A-Za-z0-9_-]/g, '')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractHeadings(content: string): TocItem[] {
  const headings: TocItem[] = []
  const seen = new Map<string, number>()
  const lines = content.split('\n')
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const depth = match[1].length
      const text = sanitizeTitle(match[2].trim())
      const base = slugify(text)
      const count = seen.get(base) ?? 0
      const id = count === 0 ? base : `${base}-${count}`
      seen.set(base, count + 1)
      headings.push({ id, text, depth })
    }
  }
  return headings
}

function readPostMeta(filePath: string, categoryPath: string[]): PostMeta {
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(fileContents)
  const slug = normalizeSlug(path.basename(filePath, '.md'))
  return {
    slug,
    categoryPath,
    category: categoryPath.join('/'),
    title: sanitizeTitle(data.title ?? slug),
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : (data.date ?? ''),
    description: data.description ?? '',
  }
}

function scanDirectory(dirPath: string, categoryPath: string[], acc: PostMeta[]): void {
  const entries = fs.readdirSync(dirPath)
  for (const entry of entries) {
    if (entry.startsWith('.')) continue
    const fullPath = path.join(dirPath, entry)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      scanDirectory(fullPath, [...categoryPath, entry], acc)
    } else if (entry.endsWith('.md')) {
      acc.push(readPostMeta(fullPath, categoryPath))
    }
  }
}

function buildNode(dirPath: string, nodePath: string[]): CategoryNode {
  const entries = fs.readdirSync(dirPath)
  const posts: PostMeta[] = []
  const children: CategoryNode[] = []
  let labels: Record<string, string> = {}

  const metaPath = path.join(dirPath, '_meta.json')
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
      // accept any string-valued key as a locale label, e.g. { "en": "...", "tr": "..." }
      for (const [k, v] of Object.entries(meta)) {
        if (typeof v === 'string') labels[k] = v
      }
    } catch {
      // malformed _meta.json — ignore
    }
  }

  for (const entry of entries) {
    if (entry.startsWith('.') || entry === '_meta.json') continue
    const fullPath = path.join(dirPath, entry)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      children.push(buildNode(fullPath, [...nodePath, entry]))
    } else if (entry.endsWith('.md')) {
      posts.push(readPostMeta(fullPath, nodePath))
    }
  }

  posts.sort((a, b) => a.title.localeCompare(b.title))
  children.sort((a, b) => a.name.localeCompare(b.name))

  return {
    name: nodePath[nodePath.length - 1] ?? '',
    path: nodePath,
    labels,
    posts,
    children,
  }
}

export function getAllPosts(): PostMeta[] {
  const acc: PostMeta[] = []
  scanDirectory(postsDirectory, [], acc)
  return acc.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostsByCategory(): Record<string, PostMeta[]> {
  const posts = getAllPosts()
  const grouped = posts.reduce<Record<string, PostMeta[]>>((acc, post) => {
    if (!acc[post.category]) acc[post.category] = []
    acc[post.category].push(post)
    return acc
  }, {})
  return Object.fromEntries(Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)))
}

function getSidebarRoot(categoryPath: string[]): CategoryNode | null {
  for (let i = 1; i <= categoryPath.length; i++) {
    const segment = categoryPath.slice(0, i)
    const metaPath = path.join(postsDirectory, ...segment, '_meta.json')
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
        if (meta.sidebarRoot === true) {
          return buildNode(path.join(postsDirectory, ...segment), segment)
        }
      } catch { /* ignore */ }
    }
  }
  return null
}

export function getCategoryLabels(category: string): Record<string, string> {
  const metaPath = path.join(postsDirectory, ...category.split('/'), '_meta.json')
  if (!fs.existsSync(metaPath)) return {}
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    return Object.fromEntries(
      Object.entries(meta).filter(([, v]) => typeof v === 'string')
    ) as Record<string, string>
  } catch {
    return {}
  }
}

export function getCategoryTree(): CategoryNode[] {
  const entries = fs.readdirSync(postsDirectory)
  const topLevel = entries
    .filter((name) => {
      if (name.startsWith('.')) return false
      return fs.statSync(path.join(postsDirectory, name)).isDirectory()
    })
    .sort((a, b) => a.localeCompare(b))

  return topLevel.map((name) => buildNode(path.join(postsDirectory, name), [name]))
}

export async function getPost(category: string, slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, ...category.split('/'), `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)
  const contentHtml = processed.toString()
  const headings = extractHeadings(content)
  const categoryPath = category.split('/')
  const sidebarRoot = getSidebarRoot(categoryPath)

  return {
    slug,
    categoryPath,
    category,
    title: sanitizeTitle(data.title ?? slug),
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : (data.date ?? ''),
    description: data.description ?? '',
    contentHtml,
    headings,
    sidebarRoot,
  }
}

export function getAllPostParams(): { path: string[] }[] {
  const params: { path: string[] }[] = []

  function collect(dirPath: string, pathSoFar: string[]): void {
    const entries = fs.readdirSync(dirPath)
    for (const entry of entries) {
      if (entry.startsWith('.')) continue
      const fullPath = path.join(dirPath, entry)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        collect(fullPath, [...pathSoFar, entry])
      } else if (entry.endsWith('.md')) {
        params.push({ path: [...pathSoFar, normalizeSlug(entry.replace(/\.md$/, ''))] })
      }
    }
  }

  collect(postsDirectory, [])
  return params
}
