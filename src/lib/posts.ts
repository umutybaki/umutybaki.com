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

const postsDirectory = path.join(process.cwd(), 'posts')

export interface TocItem {
  id: string
  text: string
  depth: number
}

export interface PostMeta {
  slug: string
  category: string
  title: string
  date: string
  description: string
}

export interface Post extends PostMeta {
  contentHtml: string
  headings: TocItem[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractHeadings(content: string): TocItem[] {
  const headings: TocItem[] = []
  const lines = content.split('\n')
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const depth = match[1].length
      const text = match[2].trim()
      const id = slugify(text)
      headings.push({ id, text, depth })
    }
  }
  return headings
}

export function getAllPosts(): PostMeta[] {
  const categories = fs.readdirSync(postsDirectory).filter((name) => {
    return fs.statSync(path.join(postsDirectory, name)).isDirectory()
  })

  const posts: PostMeta[] = []

  for (const category of categories) {
    const categoryDir = path.join(postsDirectory, category)
    const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.md'))

    for (const file of files) {
      const slug = file.replace(/\.md$/, '')
      const fullPath = path.join(categoryDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      posts.push({
        slug,
        category,
        title: data.title ?? slug,
        date: data.date ?? '',
        description: data.description ?? '',
      })
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
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

export async function getPost(category: string, slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, category, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)
  const contentHtml = processed.toString()
  const headings = extractHeadings(content)

  return {
    slug,
    category,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    contentHtml,
    headings,
  }
}

export function getAllPostParams(): { category: string; slug: string }[] {
  const categories = fs.readdirSync(postsDirectory).filter((name) => {
    return fs.statSync(path.join(postsDirectory, name)).isDirectory()
  })

  const params: { category: string; slug: string }[] = []

  for (const category of categories) {
    const categoryDir = path.join(postsDirectory, category)
    const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.md'))
    for (const file of files) {
      params.push({ category, slug: file.replace(/\.md$/, '') })
    }
  }

  return params
}