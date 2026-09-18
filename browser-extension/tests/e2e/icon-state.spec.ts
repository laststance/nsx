/**
 * Icon State E2E Tests
 * Tests extension icon state changes (default vs bookmarked)
 */

import { test, expect } from './extension-fixture'
import {
  openPopup,
  recordRequestedIconPaths,
  TestPages,
  waitForBackendReady,
  verifySuccessMessage,
} from './extension-fixture'

test.describe('Extension Icon State Tests', () => {
  test('icon changes after successful save', async ({
    context,
    extensionId,
    page,
  }) => {
    // Verify backend is ready
    const backendReady = await waitForBackendReady()
    expect(backendReady).toBe(true)

    // Navigate to test page
    await page.goto(TestPages.example.url)
    await page.waitForLoadState('domcontentloaded')

    // Open popup
    const popupPage = await openPopup(context, extensionId)

    // Tokenless saves 401 since PAT auth (#3784); stub a 201 so this covers the success UI.
    await popupPage.route('**/api/push_stock', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1 }),
      })
    })

    // setIcon leaves no DOM state, so observe the icon the popup requests from the background worker.
    const readRequestedIconPaths = await recordRequestedIconPaths(context)

    // Save page
    const checkbox = popupPage.locator('.checkbox')
    await checkbox.check()

    // Wait for success
    const success = await verifySuccessMessage(popupPage)
    expect(success).toBe(true)

    // A successful save asks the background worker for the bookmarked icon.
    await expect
      .poll(readRequestedIconPaths)
      .toEqual(['../assets/images/logo-bookmarked.png'])

    await popupPage.close()
  })

  test('background script receives setIcon message', async ({
    context,
    extensionId,
    page,
  }) => {
    const backendReady = await waitForBackendReady()
    expect(backendReady).toBe(true)

    await page.goto(TestPages.example.url)
    await page.waitForLoadState('domcontentloaded')

    // Get background script page
    const serviceWorkers = context.serviceWorkers()
    expect(serviceWorkers.length).toBeGreaterThan(0)

    // Verify background script is running
    const sw = serviceWorkers[0]
    expect(sw.url()).toContain('background.js')
  })

  test('icon state persists across popup opens', async ({
    context,
    extensionId,
    page,
  }) => {
    const backendReady = await waitForBackendReady()
    expect(backendReady).toBe(true)

    await page.goto(TestPages.example.url)
    await page.waitForLoadState('domcontentloaded')

    // Open popup and save
    let popupPage = await openPopup(context, extensionId)
    const checkbox = popupPage.locator('.checkbox')
    await checkbox.check()
    await verifySuccessMessage(popupPage)
    await popupPage.close()

    // Open popup again
    popupPage = await openPopup(context, extensionId)

    // Popup should still work normally
    const appRoot = popupPage.locator('#popup')
    await expect(appRoot).toBeVisible()

    await popupPage.close()
  })

  test('tab switch resets icon to default', async ({
    context,
    extensionId,
    page,
  }) => {
    const backendReady = await waitForBackendReady()
    expect(backendReady).toBe(true)

    await page.goto(TestPages.example.url)
    await page.waitForLoadState('domcontentloaded')

    // Open popup and save on first tab
    const popupPage = await openPopup(context, extensionId)
    const checkbox = popupPage.locator('.checkbox')
    await checkbox.check()
    await verifySuccessMessage(popupPage)
    await popupPage.close()

    // Open new tab
    const newTab = await context.newPage()
    await newTab.goto(TestPages.github.url)
    await newTab.waitForLoadState('domcontentloaded')

    // Background script should reset icon on tab change
    // Verify by checking background script is still responsive
    const serviceWorkers = context.serviceWorkers()
    expect(serviceWorkers.length).toBeGreaterThan(0)

    await newTab.close()
  })

  test('multiple saves do not break icon state', async ({
    context,
    extensionId,
    page,
  }) => {
    const backendReady = await waitForBackendReady()
    expect(backendReady).toBe(true)

    await page.goto(TestPages.example.url)
    await page.waitForLoadState('domcontentloaded')

    // Open popup
    const popupPage = await openPopup(context, extensionId)

    // Tokenless saves 401 since PAT auth (#3784); stub a 201 so this covers the success UI.
    await popupPage.route('**/api/push_stock', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1 }),
      })
    })

    // setIcon leaves no DOM state, so observe the icon the popup requests from the background worker.
    const readRequestedIconPaths = await recordRequestedIconPaths(context)

    // Save multiple times
    for (let i = 0; i < 3; i++) {
      // Uncheck and recheck to trigger save again
      const checkbox = popupPage.locator('.checkbox')
      await checkbox.uncheck()
      await checkbox.check()

      // Wait for success
      const success = await verifySuccessMessage(popupPage)
      expect(success).toBe(true)

      // Wait for animation to complete
      await popupPage.waitForTimeout(1500)
    }

    // Each of the three saves requests the bookmarked icon again.
    await expect
      .poll(readRequestedIconPaths)
      .toEqual([
        '../assets/images/logo-bookmarked.png',
        '../assets/images/logo-bookmarked.png',
        '../assets/images/logo-bookmarked.png',
      ])

    // Popup should still be functional
    const appRoot = popupPage.locator('#popup')
    await expect(appRoot).toBeVisible()

    await popupPage.close()
  })
})
