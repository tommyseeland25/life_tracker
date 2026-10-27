import { MotionConfig } from 'framer-motion'
import { Showcase } from './features/design/Showcase'

export default function App() {
  return (
    // reducedMotion="user" makes Framer Motion respect prefers-reduced-motion everywhere
    <MotionConfig reducedMotion="user">
      <Showcase />
    </MotionConfig>
  )
}
