/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

// Resolve the project root for path aliases; `__dirname` is undefined under ESM.
const DIR_NAME =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// Patterns excluded from every project (build output, vendored deps, Storybook, the WXT extension).
const SHARED_EXCLUDE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/cypress/**',
  '**/.{idea,git,cache,output,temp}/**',
  '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
  '**/*.storybook.test.*', // Exclude storybook tests for now
  '**/browser-extension/**',
]

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(DIR_NAME, './'),
      '@/src': path.resolve(DIR_NAME, './src'),
    },
  },
  optimizeDeps: {
    include: ['@mdx-js/react', 'markdown-to-jsx'],
  },
  test: {
    // Two projects so Express/server tests run in Node without the jsdom-only
    // setup (setupTests.ts builds a MatchMediaMock that needs `window`).
    projects: [
      {
        // Frontend SPA + shared lib + scripts: jsdom env with DOM test setup (MSW, matchMedia, jest-dom).
        extends: true,
        test: {
          name: 'web',
          environment: 'jsdom',
          globals: true,
          include: [
            'src/**/*.{spec,test}.{js,jsx,ts,tsx}',
            'src/**/__tests__/**/*.{js,jsx,ts,tsx}',
            'lib/**/*.{spec,test}.{js,jsx,ts,tsx}',
            'scripts/**/*.{spec,test}.{js,jsx,ts,tsx}',
          ],
          exclude: SHARED_EXCLUDE,
          setupFiles: ['setupTests.ts'],
        },
      },
      {
        // Express API/server unit tests: Node env, no DOM setup. Foundation for the PAT auth tests (PR2).
        extends: true,
        test: {
          name: 'server',
          environment: 'node',
          globals: true,
          include: ['server/**/*.{spec,test}.{ts,tsx}'],
          exclude: SHARED_EXCLUDE,
        },
      },
    ],
  },
})
