interface Props {
  children: React.ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="section-title reveal active">
      {children}
    </h1>
  )
}