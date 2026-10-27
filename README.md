# Life OS

A personal tracking website for one person: daily habits and tasks, a journal, life "areas" with plans and metrics, insights charts, and a reading library. Everything lives in your browser; no account, no server.

Built with React + TypeScript + Vite, Tailwind CSS (plus CSS-variable design tokens), Framer Motion, and hand-written SVG charts.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Unit tests for the logic in `src/lib` (Vitest) |
| `npm run lint` | Lint with oxlint |

To use it on your phone, deploy `dist/` to any static host (Netlify, Vercel, GitHub Pages). Routing uses the URL hash (`/#/journal`), so no server rewrite rules are needed. Note that data is stored per browser, so your phone and laptop will each have their own copy until you add a backend (see below) or move data with export/import.

## Where your data is stored

All data is one JSON document in the browser's `localStorage` under the key `lifeos.data`. It is saved synchronously on every change. The theme choice is stored separately under `lifeos.theme` because it is a per-device preference, so it is not part of exports.

**Back it up:** Settings → Export JSON downloads everything. Import JSON restores it (the file is validated first, and a bad file is rejected without touching your data). Clearing your browser's site data deletes your data, so export now and then.

### Data model (`src/types/models.ts`)

Everything time-based is keyed by a local date string `YYYY-MM-DD`, so a "new day" is simply a date with no entries yet. Nothing is ever deleted by the daily reset.

- `Area`: id, name, color, order, archived, pinned plan text
- `Habit`: belongs to an area, has `createdAt`, archived instead of deleted
- `checks`: `{ [date]: habitId[] }`, which habits were done each day
- `DailyTask`: date + text + done (today-only tasks)
- `journal`: `{ [date]: { text, updatedAt } }`, one entry per day
- `AreaEntry` / `AreaMetric`: dated notes and numeric readings per area
- `Book`: title, author, status (`reading` | `want` | `read`), dates, rating, notes, cover

Archiving a habit or area hides it from daily use but keeps it in history, so old stats stay accurate.

## Project layout

```
src/
  types/models.ts          data shapes
  lib/
    storage/               Storage interface, localStorage adapter, export/import, seed data
    dates.ts               local date-key helpers (the DST/UTC traps live here)
    today.ts               daily-reset logic: toggle checks, which habits show, carry-over
    stats.ts               Insights math: counts, completion, streaks, neglected areas
    chart.ts, calendar.ts, journal.ts, library.ts, ranges.ts, openLibrary.ts
    *.test.ts              tests for all of the above
  store/                   React context over the Storage interface (useStore)
  hooks/                   useTheme, useToday (rolls over at midnight), useAutosave
  components/ui/           design system: Card, Button, Checkbox, TabBar, GlassNav, Sheet, ...
  components/charts/       LineChart, Donut, Ring, Heatmap (custom SVG)
  features/                one folder per tab: today, journal, insights, areas, library, settings
  styles/tokens.css        colors, radii, shadows, light/dark values
```

Logic that is easy to get subtly wrong (dates, streaks, aggregation) lives in pure functions under `src/lib` with tests; the React code under `features/` just calls them.

## Swapping in a real backend later

The app only talks to persistence through the two-method interface in `src/lib/storage/Storage.ts`:

```ts
interface Storage {
  load(): Promise<AppData>
  save(data: AppData): Promise<void>
}
```

To move to Supabase (or anything else), write a class that implements it, then pass it in: `<StoreProvider storage={new SupabaseStorage()}>` in `src/App.tsx`. No page needs to change. The simplest first version stores the whole document as one row per user. If you later want finer-grained reads and writes, that change stays inside the adapter and the store.

## Design notes

- Light and dark follow the system setting, with a manual override in Settings (applied before first paint, so there is no flash).
- Animations are springs via Framer Motion. `prefers-reduced-motion` is respected everywhere, including the charts.
- Autosave (journal, plans) saves shortly after you stop typing and immediately when you leave the page or hide the tab.
- Book search uses the Open Library API, which needs no key. Without a connection you can still add books by hand.
