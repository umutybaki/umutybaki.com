interface Props {
  children: React.ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-[1.75rem] md:text-[2rem] mb-8 font-bold tracking-[-0.02em]">
      {children}
    </h1>
  )
}