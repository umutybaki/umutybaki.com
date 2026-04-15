interface Props {
  children: React.ReactNode
}

export default function SectionTitle({ children }: Props) {
  return <h2 className="blog-category-title">{children}</h2>
}