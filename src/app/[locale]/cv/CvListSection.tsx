export interface ListItem {
  title: string
  meta: string
  description?: string
}

interface CvListSectionProps {
  items: ListItem[]
}

export default function CvListSection({ items }: CvListSectionProps) {
  return (
    <ul className="space-y-4 list-none p-0 m-0">
      {items.map((item) => (
        <li
          key={item.title}
          className="rounded-xl p-5 transition-all duration-200 hover:translate-x-0.5 bg-surface-color border border-card-border shadow-[var(--card-shadow)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
            <strong className="text-sm font-semibold text-text-primary">
              {item.title}
            </strong>
            <span className="text-xs whitespace-nowrap shrink-0 font-roboto-mono text-text-secondary">
              {item.meta}
            </span>
          </div>
          {item.description && (
            <p className="text-sm leading-relaxed mt-1 mb-0 text-text-secondary">
              {item.description}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
