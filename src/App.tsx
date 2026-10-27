import { MotionConfig } from 'framer-motion'
import { StoreProvider } from './store/StoreProvider'
import { Showcase } from './features/design/Showcase'

export default function App() {
  return (
    // reducedMotion="user" makes Framer Motion respect prefers-reduced-motion everywhere
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <Showcase />
      </StoreProvider>
    </MotionConfig>
  )
}
