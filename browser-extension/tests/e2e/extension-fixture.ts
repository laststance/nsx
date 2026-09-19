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

/** Mint-response fields the PAT specs use; a local mirror of {@link Res.MintPersonalAccessToken}, which this package's tsconfig can't see. */
type MintedPersonalAccessToken = { id: number; token: string }

export type ExtensionTestFixtures = {
  context: BrowserContext
  extensionId: string
  personalAccessToken: MintedPersonalAccessToken
}

type OpenPopupOptions = {
  stockExists?: boolean
  // false lets the popup's token-authenticated duplicate check reach the real backend.
  stubStockExists?: boolean
  // false opens the popup without a usable token: it shows its connection notice and skips the duplicate check.
  connected?: boolean
}

// Stands in for a connected token wherever the API is stubbed; the real backend would answer 401 to it.
const STUB_PERSONAL_ACCESS_TOKEN = `nsx_pat_${'e'.repeat(64)}`

export const test = base.extend<ExtensionTestFixtures>({
  // Override context to use persistent context with extension loaded
  context: async ({ channel, headless }, applyFixture) => {
    // Use development build for testing
    const currentDir = path.dirname(fileURLToPath(import.meta.url))
    const pathToExtension = path.join(
      currentDir,
      '../../.output/chrome-mv3-dev',
    )

    const context = await chromium.launchPersistentContext('', {
      // Both come from playwright.config.ts: the `chromium` channel is what lets an extension load headless
      // (the default headless shell cannot), and `--headed` / `--debug` flip `headless` to watch a run.
      channel,
      headless,
      // No `--disable-web-security`: with it, a tab the extension opens itself (chrome.runtime.openOptionsPage)
      // gets no extension APIs (`chrome.storage` is undefined), and the manifest's host_permissions already
      // exempt the popup's API calls from CORS.
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
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

  // Mints a real PAT per test; teardown revokes it even when the test fails, so no live token outlives the run.
  personalAccessToken: async ({ request }, registerFixture) => {
    const mintedToken = await mintPersonalAccessToken(request)
    await registerFixture(mintedToken)
    // Revoke is idempotent, so specs that already revoked their token still pass teardown.
    await revokePersonalAccessToken(request, mintedToken.id)
  },
})

export { expect } from '@playwright/test'

/**
 * Opens the extension popup connected (a stub token is stored unless one already is) with a deterministic stock existence response.
 * @param context - The persistent browser context with the extension loaded.
 * @param extensionId - The loaded extension ID from the service worker URL.
 * @param options - Optional popup API fixtures, defaulting stock existence to false; `stubStockExists: false` hits the real backend; `connected: false` stores no token.
 * @returns The popup page once its save state is settled: after the on-open duplicate check answered, or, with `connected: false`, once the connection notice is up.
 * @example
 * await openPopup(context, extensionId, { stockExists: true })
 * await openPopup(context, extensionId, { stubStockExists: false })
 * await openPopup(context, extensionId, { connected: false })
 */
export async function openPopup(
  context: BrowserContext,
  extensionId: string,
  options: OpenPopupOptions = {},
): Promise<Page> {
  const isConnected = options.connected !== false
  // The save checkbox only unlocks with a stored token, which the owner connects on the Options page.
  if (isConnected) await ensureStoredToken(context)

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

  // #popup is static HTML, so it can't signal readiness. The on-open duplicate check is the
  // popup's last startup request; wait for its answer so every spec starts from settled save state.
  const initialDuplicateCheck = isConnected
    ? popupPage.waitForResponse('**/api/stock/exists**', { timeout: 5000 })
    : null

  await popupPage.goto(`chrome-extension://${extensionId}/popup.html`)
  await popupPage.waitForLoadState('domcontentloaded')

  // Wait for popup container to be ready
  await popupPage.waitForSelector('#popup', { timeout: 5000 })
  // Without a usable token the popup sends no duplicate check; its last startup step is the connection notice.
  await (initialDuplicateCheck ??
    popupPage.getByRole('button', { name: 'Open options' }).waitFor())

  return popupPage
}

/**
 * Opens the extension's Options page, where the owner connects and disconnects the NSX token.
 * @param context - The persistent browser context with the extension loaded.
 * @param extensionId - The loaded extension ID from the service worker URL.
 * @returns The Options page once the stored token has been read, so the connection state is settled.
 * @example
 * const optionsPage = await openOptions(context, extensionId)
 */
export async function openOptions(
  context: BrowserContext,
  extensionId: string,
): Promise<Page> {
  const optionsPage = await context.newPage()
  await optionsPage.goto(`chrome-extension://${extensionId}/options.html`)
  // The state line only renders after the chrome.storage.local read settled.
  await optionsPage.getByTestId('pat-connection-state').waitFor()

  return optionsPage
}

/**
 * Stores a stub token through the background worker unless a token is already stored (e.g. a real one connected on the Options page); used by {@link openPopup}.
 * @param context - The persistent browser context whose extension service worker owns chrome.storage.local.
 * @returns Nothing once chrome.storage.local holds a token.
 * @example
 * await ensureStoredToken(context)
 */
async function ensureStoredToken(context: BrowserContext): Promise<void> {
  const [serviceWorker] = context.serviceWorkers()
  await serviceWorker.evaluate(async (stubToken) => {
    const storedItems = await chrome.storage.local.get('nsx_pat')
    if (typeof storedItems.nsx_pat !== 'string') {
      await chrome.storage.local.set({ nsx_pat: stubToken })
    }
  }, STUB_PERSONAL_ACCESS_TOKEN)
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
 * Mints a real PAT as the seeded owner, because the mint endpoint only accepts a web cookie session; called by the `personalAccessToken` fixture.
 * @param request - Playwright API context; it keeps the login cookies so {@link revokePersonalAccessToken} can reuse them.
 * @returns The token id (for revoking) and the raw `nsx_pat_…` value that the web UI shows only once.
 * @example
 * const { id, token } = await mintPersonalAccessToken(request)
 */
async function mintPersonalAccessToken(
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
 * Revokes a PAT through the owner's cookie session; used by the reconnect spec and the `personalAccessToken` fixture teardown.
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
 * Records each toolbar icon the background worker sets and whether Chrome could load it, because Chrome exposes no getter for the action icon; used by the icon-state specs.
 * @param context - The persistent browser context whose extension service worker sets the icons.
 * @returns A reader resolving to one `<path> -> ok` (or `<path> -> <load error>`) entry per setIcon call since recording started.
 * @example
 * const readIconUpdates = await recordIconUpdates(context)
 * await expect.poll(readIconUpdates).toEqual(['/images/logo-bookmarked.png -> ok'])
 */
export async function recordIconUpdates(
  context: BrowserContext,
): Promise<() => Promise<string[]>> {
  const [serviceWorker] = context.serviceWorkers()
  await serviceWorker.evaluate(() => {
    const iconUpdates: string[] = []
    Reflect.set(globalThis, 'iconUpdates', iconUpdates)
    const applyIcon = chrome.action.setIcon.bind(chrome.action)
    // The background looks setIcon up per call, so this wrapper sees popup-requested and tab-switch icons alike.
    Reflect.set(
      chrome.action,
      'setIcon',
      (details: chrome.action.TabIconDetails) => {
        const iconApplied = applyIcon(details)
        iconApplied.then(
          () => iconUpdates.push(`${details.path} -> ok`),
          (error: Error) =>
            iconUpdates.push(`${details.path} -> ${error.message}`),
        )
        return iconApplied
      },
    )
  })
  return () =>
    serviceWorker.evaluate(() => Reflect.get(globalThis, 'iconUpdates'))
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
    const successSpan = popupPage.getByRole('status').getByText('Success!')
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
    const errorSpan = popupPage.getByRole('status').getByText('Failed')
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
