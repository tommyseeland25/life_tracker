import { MotionConfig } from 'framer-motion'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Showcase } from './features/design/Showcase'
import { AreaDetailPage } from './features/areas/AreaDetailPage'
import { AreasPage } from './features/areas/AreasPage'
import { InsightsPage } from './features/insights/InsightsPage'
import { JournalPage } from './features/journal/JournalPage'
import { LibraryPage } from './features/library/LibraryPage'
import { TodayPage } from './features/today/TodayPage'
import { StoreProvider } from './store/StoreProvider'

export default function App() {
  return (
    // reducedMotion="user" makes Framer Motion respect prefers-reduced-motion everywhere
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<TodayPage />} />
              <Route path="journal" element={<JournalPage />} />
              <Route path="areas" element={<AreasPage />} />
              <Route path="areas/:areaId" element={<AreaDetailPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="design" element={<Showcase />} />
            </Route>
          </Routes>
        </HashRouter>
      </StoreProvider>
    </MotionConfig>
  )
}
