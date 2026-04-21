interface Props {
  children: React.ReactNode
}

export default function PostList({ children }: Props) {
  return <ul className="list-none flex flex-col gap-[0.4rem]">{children}</ul>
}