// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Tycoon-Empire/',      // ← your repo-name here
  plugins: [react()],
  optimizeDeps: { exclude: ['lucide-react'] },
})
