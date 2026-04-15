import Link from 'next/link'

interface Props {
  href: string
  title: React.ReactNode
  meta?: React.ReactNode
}

export default function PostListItem({ href, title, meta }: Props) {
  return (
    <li className="blog-post-item">
      <Link href={href} className="blog-post-link">
        <span className="blog-post-title">{title}</span>
        {meta && <span className="blog-post-date">{meta}</span>}
      </Link>
    </li>
  )
}