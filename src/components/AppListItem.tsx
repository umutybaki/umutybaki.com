import Link from 'next/link'

interface Props {
  href: string
  logo: string
  logoAlt: string
  name: string
  subtitle: React.ReactNode
  external?: boolean
}

export default function AppListItem({ href, logo, logoAlt, name, subtitle, external = true }: Props) {
  const inner = (
    <div className="flex items-center justify-start p-4 md:p-5 gap-4 md:gap-5 text-text-primary no-underline">
      <img
        src={logo}
        alt={logoAlt}
        width="48"
        height="48"
        className="w-10 h-10 md:w-12 md:h-12 rounded-[10px]"
      />
      <div className="flex-1">
        <div className="text-[1.1rem] font-semibold">
          {name}
        </div>
        <div className="text-[0.85rem] mt-[0.2rem] text-text-secondary font-roboto-mono">
          {subtitle}
        </div>
      </div>
    </div>
  )

  return (
    <li className="border border-border-color rounded-md transition-all duration-150 hover:bg-surface-hover hover:border-(--accent-hover-border)">
      {external ? (
        <a
          href={href}
          className="flex hover:opacity-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      ) : (
        <Link href={href} className="flex hover:opacity-100">
          {inner}
        </Link>
      )}
    </li>
  )
}
