import type { ListItem } from './cvData'

interface CvListSectionProps {
  items: ListItem[]
}

export default function CvListSection({ items }: CvListSectionProps) {
  return (
    <ul className="space-y-4 list-none p-0 m-0">
      {items.map((item) => (
        <li
          key={item.title.en}
          className="rounded-xl p-5 transition-all duration-200 hover:translate-x-0.5"
          style={{
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
            <strong className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <span className="lang-en">{item.title.en}</span>
              <span className="lang-tr">{item.title.tr}</span>
            </strong>
            <span
              className="text-xs whitespace-nowrap shrink-0"
              style={{ fontFamily: 'var(--font-roboto-mono), monospace', color: 'var(--text-secondary)' }}
            >
              <span className="lang-en">{item.meta.en}</span>
              <span className="lang-tr">{item.meta.tr}</span>
            </span>
          </div>
          {item.description && (
            <>
              <p className="lang-en text-sm leading-relaxed mt-1 mb-0" style={{ color: 'var(--text-secondary)' }}>
                {item.description.en}
              </p>
              <p className="lang-tr text-sm leading-relaxed mt-1 mb-0" style={{ color: 'var(--text-secondary)' }}>
                {item.description.tr}
              </p>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}
