/**
 * Icon State E2E Tests
 * Tests extension icon state changes (default vs bookmarked)
 */

import { test, expect } from './extension-fixture'
import {
  openPopup,
  recordIconUpdates,
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

    // setIcon leaves no DOM state, so observe the icons the background worker applies.
    const readIconUpdates = await recordIconUpdates(context)

    // Save page
    const checkbox = popupPage.locator('.checkbox')
    await checkbox.check()

    // Wait for success
    const success = await verifySuccessMessage(popupPage)
    expect(success).toBe(true)

    // A successful save makes Chrome show the bookmarked icon.
    await expect
      .poll(readIconUpdates)
      .toEqual(['/images/logo-bookmarked.png -> ok'])

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

  test('reopening the popup on a saved page shows the bookmarked icon', async ({
    context,
    extensionId,
    page,
  }) => {
    // Arrange
    const backendReady = await waitForBackendReady()
    expect(backendReady).toBe(true)

    await page.goto(TestPages.example.url)
    await page.waitForLoadState('domcontentloaded')

    // Save the page from a first popup.
    const firstPopupPage = await openPopup(context, extensionId)
    // Tokenless saves 401 since PAT auth (#3784); stub a 201 so the save succeeds.
    await firstPopupPage.route('**/api/push_stock', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1 }),
      })
    })
    await firstPopupPage.locator('.checkbox').check()
    const success = await verifySuccessMessage(firstPopupPage)
    expect(success).toBe(true)
    await firstPopupPage.close()

    const readIconUpdates = await recordIconUpdates(context)

    // Act — the reopened popup's duplicate check now reports the page as saved.
    const reopenedPopupPage = await openPopup(context, extensionId, {
      stockExists: true,
    })

    // Assert
    // Opening the popup as a tab also fires the tab-switch reset in tests, so check the icon Chrome ends on.
    await expect
      .poll(async () => (await readIconUpdates()).at(-1))
      .toBe('/images/logo-bookmarked.png -> ok')
    await expect(
      reopenedPopupPage.getByRole('checkbox', { name: 'Already Exists' }),
    ).toBeChecked()

    await reopenedPopupPage.close()
  })

  test('tab switch resets icon to default', async ({
    context,
    extensionId,
    page,
  }) => {
    // Arrange
    const backendReady = await waitForBackendReady()
    expect(backendReady).toBe(true)

    await page.goto(TestPages.example.url)
    await page.waitForLoadState('domcontentloaded')

    const popupPage = await openPopup(context, extensionId)
    // Tokenless saves 401 since PAT auth (#3784); stub a 201 so the save succeeds.
    await popupPage.route('**/api/push_stock', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1 }),
      })
    })
    const readIconUpdates = await recordIconUpdates(context)
    await popupPage.locator('.checkbox').check()
    const success = await verifySuccessMessage(popupPage)
    expect(success).toBe(true)
    // Start from the bookmarked icon, or a "reset" to default would prove nothing.
    await expect
      .poll(readIconUpdates)
      .toEqual(['/images/logo-bookmarked.png -> ok'])

    // Act
    const newTab = await context.newPage()
    await newTab.bringToFront()

    // Assert
    await expect
      .poll(async () => (await readIconUpdates()).at(-1))
      .toBe('/images/logo.png -> ok')

    await newTab.close()
    await popupPage.close()
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

    // setIcon leaves no DOM state, so observe the icons the background worker applies.
    const readIconUpdates = await recordIconUpdates(context)

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

    // Each of the three saves makes Chrome show the bookmarked icon again.
    await expect
      .poll(readIconUpdates)
      .toEqual([
        '/images/logo-bookmarked.png -> ok',
        '/images/logo-bookmarked.png -> ok',
        '/images/logo-bookmarked.png -> ok',
      ])

    // Popup should still be functional
    const appRoot = popupPage.locator('#popup')
    await expect(appRoot).toBeVisible()

    await popupPage.close()
  })
})
