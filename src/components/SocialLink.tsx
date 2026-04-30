interface Props {
  href: string
  icon: React.ReactNode
  label: string
}

export default function SocialLink({ href, icon, label }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-[0.45rem] px-4 py-[0.6rem] border border-border-color rounded-sm text-text-primary font-[450] text-[0.9rem] transition-colors duration-150 no-underline hover:bg-surface-hover hover:border-(--accent-hover-border-strong) hover:opacity-100 [&_svg]:text-accent-color"
    >
      {icon}
      {label}
    </a>
  )
}
