/**
 * Extension Test Fixture using Playwright's recommended approach
 * Based on https://playwright.dev/docs/chrome-extensions
 */

import path from 'path'
import { fileURLToPath } from 'url'

import {
  test as base,
  chromium,
  request as playwrightRequest,
  type BrowserContext,
  type Page,
} from '@playwright/test'

export type ExtensionTestFixtures = {
  context: BrowserContext
  extensionId: string
}

export const test = base.extend<ExtensionTestFixtures>({
  // Override context to use persistent context with extension loaded
  context: async (
    // eslint-disable-next-line no-empty-pattern
    {},
    applyFixture,
  ) => {
    // Use development build for testing
    const currentDir = path.dirname(fileURLToPath(import.meta.url))
    const pathToExtension = path.join(
      currentDir,
      '../../.output/chrome-mv3-dev',
    )

    const context = await chromium.launchPersistentContext('', {
      headless: false, // Extensions require headed mode
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--disable-web-security',
        '--allow-running-insecure-content',
      ],
    })

    await applyFixture(context)
    await context.close()
  },

  // Provide extension ID as a fixture
  extensionId: async ({ context }, registerFixture) => {
    // Wait for service worker to be registered
    let serviceWorker = context.serviceWorkers()[0]

    // If not immediately available, wait for it
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker', {
        timeout: 10000,
      })
    }

    // Extract extension ID from service worker URL
    // Format: chrome-extension://[extension-id]/background.js
    const extensionId = serviceWorker.url().split('/')[2]

    await registerFixture(extensionId)
  },
})

export { expect } from '@playwright/test'

/**
 * Helper to open extension popup
 */
export async function openPopup(
  context: BrowserContext,
  extensionId: string,
): Promise<Page> {
  const popupPage = await context.newPage()
  await popupPage.goto(`chrome-extension://${extensionId}/popup.html`)
  await popupPage.waitForLoadState('domcontentloaded')

  // Wait for popup container to be ready
  await popupPage.waitForSelector('#popup', { timeout: 5000 })

  return popupPage
}

/**
 * Helper to wait for backend API
 */
export async function waitForBackendReady(maxAttempts = 10): Promise<boolean> {
  const requestContext = await playwrightRequest.newContext()
  try {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await requestContext.get(
          'http://localhost:4000/api/user_count',
        )
        if (response.ok()) {
          return true
        }
      } catch {
        // Backend not ready yet
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return false
  } finally {
    await requestContext.dispose()
  }
}

/**
 * Test data: Sample pages to save
 */
export const TestPages = {
  example: {
    title: 'Example Domain',
    url: 'https://example.com',
  },
  github: {
    title: 'GitHub',
    url: 'https://github.com',
  },
  playwright: {
    title: 'Playwright',
    url: 'https://playwright.dev',
  },
}

/**
 * Helper to verify success message appears
 */
export async function verifySuccessMessage(popupPage: Page): Promise<boolean> {
  try {
    const successSpan = popupPage.locator('.result span:has-text("Success!")')
    await successSpan.waitFor({ state: 'visible', timeout: 3000 })
    return true
  } catch {
    return false
  }
}

/**
 * Helper to verify error message appears
 */
export async function verifyErrorMessage(popupPage: Page): Promise<boolean> {
  try {
    const errorSpan = popupPage.locator('.result span:has-text("Failed")')
    await errorSpan.waitFor({ state: 'visible', timeout: 3000 })
    return true
  } catch {
    return false
  }
}

/**
 * Helper to get tweet button URL
 */
export async function getTweetButtonUrl(popupPage: Page): Promise<string> {
  const tweetBtn = popupPage.locator('.twitter-btn')
  const href = await tweetBtn.getAttribute('href')
  return href || ''
}

/**
 * Helper to type comment in textarea
 */
export async function typeComment(
  popupPage: Page,
  comment: string,
): Promise<void> {
  const textarea = popupPage.locator('.comment')
  await textarea.fill(comment)
  await textarea.blur() // Trigger onBlur event
}

/**
 * Helper to get current page info
 */
export async function getCurrentPageInfo(
  page: Page,
): Promise<{ title: string; url: string }> {
  const title = await page.title()
  const url = page.url()
  return { title, url }
}
