import { MotionConfig } from 'framer-motion'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Showcase } from './features/design/Showcase'
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
              <Route path="journal" element={<ComingSoon title="Journal" phase={4} />} />
              <Route path="areas" element={<ComingSoon title="Areas" phase={5} />} />
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
