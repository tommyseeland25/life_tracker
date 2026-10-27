import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Tests run in Michigan's timezone (inherited by test workers) so date bugs can't hide.
process.env.TZ = 'America/Detroit'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: { environment: 'node' },
})
