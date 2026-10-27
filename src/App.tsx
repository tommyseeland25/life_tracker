import { MotionConfig } from 'framer-motion'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Showcase } from './features/design/Showcase'
import { AreaDetailPage } from './features/areas/AreaDetailPage'
import { AreasPage } from './features/areas/AreasPage'
import { JournalPage } from './features/journal/JournalPage'
import { ComingSoon } from './features/placeholder/ComingSoon'
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
              <Route path="insights" element={<ComingSoon title="Insights" phase={6} />} />
              <Route path="library" element={<ComingSoon title="Library" phase={7} />} />
              <Route path="design" element={<Showcase />} />
            </Route>
          </Routes>
        </HashRouter>
      </StoreProvider>
    </MotionConfig>
  )
}
