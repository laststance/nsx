// see https://github.com/remarkjs/react-markdown/issues/635#issuecomment-1086867248
const esModules = [
  'react-markdown',
  'vfile',
  'unist-.+',
  'unified',
  'bail',
  'is-plain-obj',
  'trough',
  'remark-.+',
  'mdast-util-.+',
  'micromark',
  'parse-entities',
  'character-entities',
  'property-information',
  'comma-separated-tokens',
  'hast-util-whitespace',
  'remark-.+',
  'space-separated-tokens',
  'decode-named-character-reference',
  'ccount',
  'escape-string-regexp',
  'markdown-table',
  'rehype-raw',
  'hast-util-raw',
  'hast-util-from-parse5',
  'hastscript',
  'hast-util-parse-selector',
  'web-namespaces',
  'hast-util-to-parse5',
  'hast-to-hyperscript',
  'zwitch',
  'html-void-elements',
].join('|')

const config = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'mjs', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    'react-markdown': '<rootDir>/__test__/mocks/react-markdown.jsx',
  },
  notify: true,
  notifyMode: 'success-change',
  resetMocks: true,
  resolver: '<rootDir>/jest/resolver.js',
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest/setupTests.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)':
      '<rootDir>/jest/fileTransform.js',
    '^.+\\.[jt]sx?$': 'esbuild-jest',
    '^.+\\.css$': '<rootDir>/jest/cssTransform.js',
  },
  transformIgnorePatterns: [
    `[/\\\\]node_modules[/\\\\](?!${esModules}).+\\.(js|jsx|mjs|cjs|ts|tsx)$`,
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}

module.exports = config
