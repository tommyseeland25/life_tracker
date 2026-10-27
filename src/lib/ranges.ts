import type { DateKey } from '../types/models'
import { addDays, dateRange } from './dates'

export type RangePreset = 'Week' | 'Month' | 'All time'

/** The days an Insights view covers, oldest first, always ending today. */
export function rangeFor(preset: RangePreset, today: DateKey, checks: Record<DateKey, string[]>): DateKey[] {
  if (preset === 'Week') return dateRange(addDays(today, -6), today)
  if (preset === 'Month') return dateRange(addDays(today, -29), today)
  const first = Object.keys(checks).sort()[0]
  return dateRange(first && first < today ? first : today, today)
}
