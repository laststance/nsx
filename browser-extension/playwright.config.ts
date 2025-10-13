import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright Configuration for WXT Browser Extension E2E Tests
 * 
 * This configuration is specifically designed for testing Chrome extensions built with WXT.
 * Key requirements:
 * - Extensions require non-headless mode
 * - Extension must be loaded via --load-extension flag
 * - Backend API server must be running on port 4000
 */

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Timeout for each test
  timeout: 30000,
  
  // Global test timeout
  globalTimeout: 10 * 60 * 1000, // 10 minutes
  
  // Expect timeout
  expect: {
    timeout: 5000,
  },
  
  // Run tests sequentially (extension tests can interfere with each other)
  fullyParallel: false,
  
  // Single worker for extension tests
  workers: 1,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Reporter to use
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { outputFolder: 'test-results/html' }],
  ],
  
  // Shared settings for all projects
  use: {
    // IMPORTANT: Extensions require non-headless mode
    headless: false,
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Browser context options
    contextOptions: {
      // Ignore HTTPS errors for local testing
      ignoreHTTPSErrors: true,
    },
  },

  // Configure project for Chrome extension testing
  projects: [
    {
      name: 'chromium-extension',
      use: { 
        ...devices['Desktop Chrome'],
        // IMPORTANT: Extensions require channel: 'chromium' for proper support
        channel: 'chromium',
      },
    },
  ],

  // Output directory for test artifacts
  outputDir: 'test-results/artifacts',
  
  // Global setup - build extension before tests
  globalSetup: './tests/e2e/global-setup.ts',
  
  // Backend server dependency
  // Extension needs backend API running on port 4000
  webServer: {
    command: 'cd .. && pnpm server:start',
    port: 4000,
    timeout: 120 * 1000,
    reuseExistingServer: true,
    env: {
      // Copy necessary environment variables
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'test-secret',
      DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:rootpass@127.0.0.1:3306/digital',
      // Add other required env vars as needed
    },
  },
});