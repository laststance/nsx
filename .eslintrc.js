module.exports = {
  env: {
    'cypress/globals': true,
  },
  extends: ['ts-prefixer', 'plugin:jsx-a11y/recommended'],
  globals: {
    JSX: 'readonly',
  },
  plugins: ['cypress', 'jsx-a11y', 'react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    typescript: {
      alwaysTryTypes: true,
      // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      project: ['server/tsconfig.json'],
    },
  },
}
