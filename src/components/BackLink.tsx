import Link from 'next/link'

interface Props {
  href: string
  label: string
}

export default function BackLink({ href, label }: Props) {
  return (
    <Link href={href} className="inline-flex items-center gap-[0.4rem] text-text-secondary text-[0.875rem] transition-opacity duration-150 mb-8 hover:opacity-60">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      {label}
    </Link>
  )
}