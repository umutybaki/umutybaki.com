interface Props {
  children: React.ReactNode
}

export default function SectionTitle({ children }: Props) {
  return <h2 className="text-[0.7rem] font-roboto-mono text-accent-color font-semibold uppercase tracking-[0.12em] mb-4">{children}</h2>
}