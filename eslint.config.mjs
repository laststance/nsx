import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import jsxA11Y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    files: ['**/*.tsx', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
  },
  {
    ignores: [
      '**/node_modules',
      '**/build',
      '**/images',
      '**/server_build',
      'db/scripts',
      '**/tailwind.config.js',
      '**/storybook-static',
      '**/package.json',
      '**/coverage',
      'public/mockServiceWorker.js',
      'playwright-report',
      'test-results',
      '.storybook',
    ],
  },
  ...compat.extends('ts-prefixer', 'plugin:jsx-a11y/recommended'),
  {
    plugins: {
      'jsx-a11y': jsxA11Y,
      'react-hooks': fixupPluginRules(reactHooks),
      react,
    },

    languageOptions: {
      globals: {
        JSX: 'readonly',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },

      typescript: {
        alwaysTryTypes: true,
        project: ['server/tsconfig.json'],
      },
    },

    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react/display-name': 'warn',
    },
  },
]
