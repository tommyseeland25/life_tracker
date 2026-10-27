import { Link, useParams } from 'react-router-dom'
import { useStore } from '../../store/storeContext'
import { EntriesCard } from './EntriesCard'
import { MetricsCard } from './MetricsCard'
import { PlanCard } from './PlanCard'

export function AreaDetailPage() {
  const { areaId } = useParams()
  const { data } = useStore()
  const area = data.areas.find((a) => a.id === areaId)

  if (!area) {
    return (
      <>
        <h1 className="text-5xl font-semibold">Area not found</h1>
        <Link to="/areas" className="mt-4 inline-block text-[var(--accent)]">‹ All areas</Link>
      </>
    )
  }

  return (
    <>
      <Link to="/areas" className="text-[var(--accent)] outline-none focus-visible:underline">‹ Areas</Link>
      <div className="mt-2 flex items-center gap-4">
        <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: area.color }} />
        <h1 className="text-5xl font-semibold sm:text-6xl">{area.name}</h1>
      </div>
      <div className="mt-10 space-y-6">
        <PlanCard key={area.id} areaId={area.id} />
        <MetricsCard areaId={area.id} color={area.color} />
        <EntriesCard areaId={area.id} />
      </div>
    </>
  )
}
