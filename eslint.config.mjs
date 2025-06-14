// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { defineConfig } from 'eslint/config'
import tsPrefixer from 'eslint-config-ts-prefixer'
import reactHooks from 'eslint-plugin-react-hooks'

import noJsxWithoutReturn from './eslint-plugin-no-jsx-without-return.js'

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
    ],
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      'no-jsx-without-return': noJsxWithoutReturn,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'no-jsx-without-return/no-jsx-without-return': 'error',
    },
  },
])
