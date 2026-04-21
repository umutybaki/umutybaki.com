import Link from 'next/link'

interface Props {
  href: string
  title: React.ReactNode
  meta?: React.ReactNode
}

export default function PostListItem({ href, title, meta }: Props) {
  return (
    <li className="border border-border-color rounded-md transition-all duration-150 hover:bg-surface-hover hover:border-[rgba(255,100,0,0.25)]">
      <Link href={href} className="flex flex-col md:flex-row md:justify-between items-start md:items-center p-[1.1rem_1.25rem] text-text-primary no-underline hover:opacity-100 gap-1 md:gap-0">
        <span className="font-[450] text-[0.95rem]">{title}</span>
        {meta && <span className="font-roboto-mono text-[0.75rem] text-text-secondary whitespace-nowrap md:ml-4">{meta}</span>}
      </Link>
    </li>
  )
}