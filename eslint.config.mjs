import lastStancePlugin from '@laststance/react-next-eslint-plugin'
import { defineConfig } from 'eslint/config'
import tsPrefixer from 'eslint-config-ts-prefixer'
import reactHooks from 'eslint-plugin-react-hooks'

export default defineConfig([
  ...tsPrefixer,
  {
    ignores: [
      'build/**',
      'server_build/**',
      'prisma/**',
      'storybook-static/**',
      'coverage/**',
      'public/mockServiceWorker.js',
      'playwright-report/**',
      'test-results/**',
      '.storybook/**',
      '.conductor',
      'browser-extension/**',
    ],
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      laststance: lastStancePlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'laststance/no-jsx-without-return': 'error',
    },
  },
])
