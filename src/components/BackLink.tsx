import Link from 'next/link'

interface Props {
  href: string
  label: string
}

export default function BackLink({ href, label }: Props) {
  return (
    <Link href={href} className="back-link">
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