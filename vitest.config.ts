import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['**/node_modules/**', 'tests/e2e/**'],
    environmentMatchGlobs: [
      ['tests/unit/**', 'node'],
      ['tests/components/**', 'jsdom'],
    ],
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})
