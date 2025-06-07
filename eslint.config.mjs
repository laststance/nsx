// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { defineConfig } from 'eslint/config'
import tsPrefixer from 'eslint-config-ts-prefixer'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'

import noJsxWithoutReturn from './eslint-plugin-no-jsx-without-return.js'

export default defineConfig([
  ...tsPrefixer,
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/images/**',
      '**/server_build/**',
      'db/scripts/**',
      '**/tailwind.config.js',
      '**/storybook-static/**',
      '**/package.json',
      '**/coverage/**',
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
  ...storybook.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
])
