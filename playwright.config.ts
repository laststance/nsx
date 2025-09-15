import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config()

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  // globalSetup: require.resolve('./e2e/global-setup'),
  // globalTeardown: require.resolve('./e2e/global-teardown'),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    launchOptions: {
      slowMo: isHeadedOrUIMode() ? 700 : 400,
    },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  webServer: [
    {
      name: 'Frontend',
      command: 'pnpm preview',
      url: 'http://localhost:3000',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      name: 'Backend',
      command: 'pnpm server:start',
      url: 'http://localhost:4000/api/user_count',
      timeout: 120 * 1000,
      reuseExistingServer: true,
      env: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
        BLUESKY_USERNAME: process.env.BLUESKY_USERNAME!,
        BLUESKY_PASSWORD: process.env.BLUESKY_PASSWORD!,
        DATABASE_URL: process.env.DATABASE_URL!,
      },
    },
  ],
})

function isHeadedOrUIMode() {
  // important to use env var - for workers
  if (process.argv.includes('--headed')) process.env.HEADED_MODE = '1'
  return Boolean(process.env.HEADED_MODE)
}
