/**
 * Personal Access Token E2E Tests
 * Drives the real backend with a token minted through the web API; no API route is stubbed here.
 */

import {
  expect,
  mintPersonalAccessToken,
  openPopup,
  revokePersonalAccessToken,
  test,
} from './extension-fixture'

test.describe('Extension Personal Access Token flow', () => {
  test('saves the current page after pasting a token minted on the web', async ({
    context,
    extensionId,
    page,
    request,
  }) => {
    // Arrange
    const { id, token } = await mintPersonalAccessToken(request)
    // A fresh URL per run keeps a persistent local DB from answering 409 Already Exists.
    await page.goto(`https://example.com/?nsx-pat-e2e=${Date.now()}`)
    await page.waitForLoadState('domcontentloaded')
    const popupPage = await openPopup(context, extensionId, {
      stubStockExists: false,
    })
    await popupPage.getByTestId('pat-input').fill(token)
    // Connecting re-runs the duplicate check with the token; wait so its reply can't reset the checkbox mid-save.
    const tokenDuplicateCheck = popupPage.waitForResponse(
      async (response) =>
        response.url().includes('/api/stock/exists') &&
        (await response.request().headerValue('authorization')) ===
          `Bearer ${token}`,
    )
    await popupPage.getByTestId('pat-connect-btn').click()
    await tokenDuplicateCheck

    // Act
    await popupPage.locator('.checkbox').check()

    // Assert
    // Success! clears after FEEDBACK_CLEAR_DELAY_MS (1s), so check it before the stable connected state.
    await expect(
      popupPage.locator('.result').getByText('Success!'),
    ).toBeVisible()
    await expect(popupPage.getByTestId('pat-connected-status')).toBeVisible()

    // Reopening proves the save persisted: the token-authenticated duplicate check now finds it.
    await popupPage.close()
    const reopenedPopup = await openPopup(context, extensionId, {
      stubStockExists: false,
    })
    await expect(
      reopenedPopup.locator('.result').getByText('Already Exists'),
    ).toBeVisible()
    await expect(reopenedPopup.locator('.checkbox')).toBeChecked()
    await expect(reopenedPopup.locator('.checkbox')).toBeDisabled()

    // Cleanup: revoke so re-runs against a persistent local DB don't leave live tokens behind.
    await revokePersonalAccessToken(request, id)
  })

  test('asks to reconnect when the pasted token is revoked on the web', async ({
    context,
    extensionId,
    page,
    request,
  }) => {
    // Arrange
    const { id, token } = await mintPersonalAccessToken(request)
    await page.goto(`https://example.com/?nsx-pat-e2e=${Date.now()}`)
    await page.waitForLoadState('domcontentloaded')
    const popupPage = await openPopup(context, extensionId, {
      stubStockExists: false,
    })
    await popupPage.getByTestId('pat-input').fill(token)
    await popupPage.getByTestId('pat-connect-btn').click()
    await expect(popupPage.getByTestId('pat-connected-status')).toBeVisible()
    await popupPage.close()
    await revokePersonalAccessToken(request, id)

    // Act
    const reopenedPopup = await openPopup(context, extensionId, {
      stubStockExists: false,
    })

    // Assert
    const reconnectNotice = reopenedPopup.getByTestId('pat-reconnect-notice')
    await expect(reconnectNotice).toBeVisible()
    await expect(reconnectNotice).toHaveText(
      'Your saved token was rejected. Paste a new token to reconnect.',
    )
    await expect(reopenedPopup.getByTestId('pat-connect-panel')).toBeVisible()
    await expect(reopenedPopup.getByTestId('pat-connected-status')).toBeHidden()
  })
})
