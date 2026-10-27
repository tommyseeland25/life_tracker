import { Card } from '../../components/ui/Card'

export function ComingSoon({ title, phase }: { title: string; phase: number }) {
  return (
    <>
      <h1 className="text-5xl font-semibold sm:text-6xl">{title}</h1>
      <Card className="mt-10">
        <p className="text-[var(--text-muted)]">Coming in Phase {phase}.</p>
      </Card>
    </>
  )
}
