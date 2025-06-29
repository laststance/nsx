/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, './'),
      '@/src': path.resolve(dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@mdx-js/react', 'markdown-to-jsx'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'src/**/*.{spec,test}.{js,jsx,ts,tsx}',
      'src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      'lib/**/*.{spec,test}.{js,jsx,ts,tsx}',
      'scripts/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/*.storybook.test.*', // Exclude storybook tests for now
    ],
    setupFiles: ['setupTests.ts'],
  },
})
