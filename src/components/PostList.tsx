interface Props {
  children: React.ReactNode
}

export default function PostList({ children }: Props) {
  return <ul className="blog-post-list">{children}</ul>
}