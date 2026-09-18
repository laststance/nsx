/**
 * Extension Test Fixture using Playwright's recommended approach
 * Based on https://playwright.dev/docs/chrome-extensions
 */

import path from 'path'
import { fileURLToPath } from 'url'

import {
  test as base,
  chromium,
  expect,
  request as playwrightRequest,
  type APIRequestContext,
  type BrowserContext,
  type Page,
} from '@playwright/test'

export type ExtensionTestFixtures = {
  context: BrowserContext
  extensionId: string
}

/** Mint-response fields the PAT specs use; a local mirror of {@link Res.MintPersonalAccessToken}, which this package's tsconfig can't see. */
type MintedPersonalAccessToken = { id: number; token: string }

type OpenPopupOptions = {
  stockExists?: boolean
  // false lets the popup's token-authenticated duplicate check reach the real backend.
  stubStockExists?: boolean
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
 * Opens the extension popup with a deterministic stock existence response.
 * @param context - The persistent browser context with the extension loaded.
 * @param extensionId - The loaded extension ID from the service worker URL.
 * @param options - Optional popup API fixtures, defaulting stock existence to false; `stubStockExists: false` hits the real backend.
 * @returns The popup page after the React root is ready.
 * @example
 * await openPopup(context, extensionId, { stockExists: true })
 * await openPopup(context, extensionId, { stubStockExists: false })
 */
export async function openPopup(
  context: BrowserContext,
  extensionId: string,
  options: OpenPopupOptions = {},
): Promise<Page> {
  const popupPage = await context.newPage()
  // Real-backend PAT specs opt out so the Bearer duplicate check is exercised, not faked.
  if (options.stubStockExists !== false) {
    await popupPage.route('**/api/stock/exists**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exists: options.stockExists ?? false }),
      })
    })
  }

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
 * Mints a real PAT as the seeded owner, because the mint endpoint only accepts a web cookie session; used by the PAT specs.
 * @param request - Playwright API context; it keeps the login cookies so {@link revokePersonalAccessToken} can reuse them.
 * @returns The token id (for revoking) and the raw `nsx_pat_…` value that the web UI shows only once.
 * @example
 * const { id, token } = await mintPersonalAccessToken(request)
 */
export async function mintPersonalAccessToken(
  request: APIRequestContext,
): Promise<MintedPersonalAccessToken> {
  // Seeded owner from prisma/seed.ts, the same account the web e2e logs in as.
  const loginResponse = await request.post('http://localhost:4000/api/login', {
    data: { name: 'John Doe', password: 'popcoon' },
  })
  expect(loginResponse.status()).toBe(200)

  const mintResponse = await request.post(
    'http://localhost:4000/api/personal_access_token',
    { data: { name: 'Playwright e2e' } },
  )
  expect(mintResponse.status()).toBe(201)

  const mintedToken: MintedPersonalAccessToken = await mintResponse.json()
  return mintedToken
}

/**
 * Revokes a PAT through the owner's cookie session so the extension holds a rejected token; used by the reconnect spec.
 * @param request - The API context that ran {@link mintPersonalAccessToken}; its login cookies authorize the revoke.
 * @param id - The token id returned by {@link mintPersonalAccessToken}.
 * @returns Nothing; the test fails unless the server confirms the revoke.
 * @example
 * await revokePersonalAccessToken(request, id)
 */
export async function revokePersonalAccessToken(
  request: APIRequestContext,
  id: number,
): Promise<void> {
  const revokeResponse = await request.delete(
    `http://localhost:4000/api/personal_access_token/${id}`,
  )
  expect(revokeResponse.status()).toBe(200)
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
