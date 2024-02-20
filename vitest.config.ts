import path from 'node:path'

import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'src/**/*.{spec,test}.{js,jsx,ts,tsx}',
      'src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      'lib/**/*.{spec,test}.{js,jsx,ts,tsx}',
      'scripts/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    setupFiles: ['setupTests.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
