const esModules = require('./jest/esModules')

const config = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.*',
    '!src/redux/**',
    '!src/offscreen/Redirect.tsx',
    '!src/main.tsx',
    '!src/mockServiceWorker.js',
  ],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'mjs', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  notify: true,
  notifyMode: 'success-change',
  reporters: ['default', 'github-actions'],
  resetMocks: true,
  resolver: '<rootDir>/jest/resolver.js',
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest/setupTests.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/lib/**/*.{spec,test}.{js,jsx,ts,tsx}',
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
