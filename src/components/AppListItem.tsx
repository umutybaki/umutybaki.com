interface Props {
  href: string
  logo: string
  logoAlt: string
  name: string
  subtitle: React.ReactNode
}

export default function AppListItem({ href, logo, logoAlt, name, subtitle }: Props) {
  return (
    <li className="blog-post-item">
      <a
        href={href}
        className="blog-post-link app-item-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={logo}
          alt={logoAlt}
          width="48"
          height="48"
          className="app-item-logo"
          style={{ borderRadius: '10px' }}
        />
        <div style={{ flex: 1 }}>
          <div className="blog-post-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {name}
          </div>
          <div
            className="blog-post-date"
            style={{ marginLeft: 0, marginTop: '0.2rem', fontSize: '0.85rem' }}
          >
            {subtitle}
          </div>
        </div>
      </a>
    </li>
  )
}