import type { AppData } from '../../types/models'

export const CURRENT_VERSION = 1

const SEED_AREAS = [
  'Gym / Lifting',
  'Stretching',
  'Nutrition & Weight',
  'Knee Rehab',
  'Shoulder Rehab',
  'BJJ',
  'Coding Projects',
  'Thoughts & Perspective',
]

export function createSeedData(): AppData {
  return {
    version: CURRENT_VERSION,
    areas: SEED_AREAS.map((name, i) => ({
      id: crypto.randomUUID(),
      name,
      color: `var(--area-${i + 1})`,
      order: i,
      archived: false,
      plan: '',
    })),
    habits: [],
    checks: {},
    tasks: [],
    journal: {},
    areaEntries: [],
    areaMetrics: [],
    books: [],
    settings: { theme: 'system' },
  }
}
