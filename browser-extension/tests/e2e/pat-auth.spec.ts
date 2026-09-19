/**
 * Personal Access Token E2E Tests
 * Drives the real backend with a token minted through the web API; no API route is stubbed here.
 * The token is connected on the Options page, and the popup only ever points there.
 */

import {
  expect,
  openOptions,
  openPopup,
  revokePersonalAccessToken,
  test,
} from './extension-fixture'

test.describe('Extension Personal Access Token flow', () => {
  test('saves the current page after connecting a token minted on the web', async ({
    context,
    extensionId,
    page,
    personalAccessToken,
  }) => {
    // Arrange
    const { token } = personalAccessToken
    // A fresh URL per run keeps a persistent local DB from answering 409 Already Exists.
    await page.goto(`https://example.com/?nsx-pat-e2e=${Date.now()}`)
    await page.waitForLoadState('domcontentloaded')
    const optionsPage = await openOptions(context, extensionId)
    await optionsPage.getByTestId('pat-input').fill(token)
    await optionsPage.getByRole('button', { name: 'Connect' }).click()
    await expect(optionsPage.getByText('Connected to NSX')).toBeVisible()
    // The Options page shows the token the way the web token list does: prefix + last 4 characters.
    await expect(optionsPage.getByTestId('pat-stored-token')).toHaveText(
      `nsx_pat_…${token.slice(-4)}`,
    )
    await optionsPage.close()
    const popupPage = await openPopup(context, extensionId, {
      stubStockExists: false,
    })

    // Act
    await popupPage.locator('.checkbox').check()

    // Assert
    await expect(
      popupPage.getByRole('status').getByText('Success!'),
    ).toBeVisible()
    // Connected: nothing in the popup points to the Options page.
    await expect(
      popupPage.getByRole('button', { name: 'Open options' }),
    ).toBeHidden()

    // Reopening proves the save persisted: the token-authenticated duplicate check now finds it.
    await popupPage.close()
    const reopenedPopup = await openPopup(context, extensionId, {
      stubStockExists: false,
    })
    await expect(
      reopenedPopup.getByRole('status').getByText('Already Exists'),
    ).toBeVisible()
    await expect(reopenedPopup.locator('.checkbox')).toBeChecked()
    await expect(reopenedPopup.locator('.checkbox')).toBeDisabled()
  })

  test('points to Options, which asks for a new token, when the connected token is revoked on the web', async ({
    context,
    extensionId,
    page,
    personalAccessToken,
    request,
  }) => {
    // Arrange
    const { id, token } = personalAccessToken
    await page.goto(`https://example.com/?nsx-pat-e2e=${Date.now()}`)
    await page.waitForLoadState('domcontentloaded')
    const optionsPage = await openOptions(context, extensionId)
    await optionsPage.getByTestId('pat-input').fill(token)
    await optionsPage.getByRole('button', { name: 'Connect' }).click()
    await expect(optionsPage.getByText('Connected to NSX')).toBeVisible()
    await optionsPage.close()
    await revokePersonalAccessToken(request, id)

    // Act
    const popupPage = await openPopup(context, extensionId, {
      stubStockExists: false,
    })

    // Assert
    await expect(
      popupPage.getByRole('status').getByText('Token rejected'),
    ).toBeVisible()
    await expect(popupPage.locator('.checkbox')).toBeDisabled()

    // The notice's link opens the Options page, which knows about the rejection the popup found.
    const openedOptionsPage = context.waitForEvent('page')
    await popupPage.getByRole('button', { name: 'Open options' }).click()
    const reopenedOptionsPage = await openedOptionsPage
    await expect(reopenedOptionsPage).toHaveURL(
      `chrome-extension://${extensionId}/options.html`,
    )
    await expect(reopenedOptionsPage.getByRole('alert')).toHaveText(
      'Your saved token was rejected. Paste a new token to reconnect.',
    )
    await expect(reopenedOptionsPage.getByTestId('pat-input')).toBeVisible()
    await expect(reopenedOptionsPage.getByText('Connected to NSX')).toBeHidden()
  })

  test('disconnects on the Options page and stays disconnected after reopening', async ({
    context,
    extensionId,
    page,
    personalAccessToken,
  }) => {
    // Arrange
    const { token } = personalAccessToken
    await page.goto(`https://example.com/?nsx-pat-e2e=${Date.now()}`)
    await page.waitForLoadState('domcontentloaded')
    const optionsPage = await openOptions(context, extensionId)
    await optionsPage.getByTestId('pat-input').fill(token)
    await optionsPage.getByRole('button', { name: 'Connect' }).click()
    await expect(optionsPage.getByText('Connected to NSX')).toBeVisible()

    // Act
    await optionsPage.getByRole('button', { name: 'Disconnect' }).click()

    // Assert
    await expect(
      optionsPage.getByText('Not connected', { exact: true }),
    ).toBeVisible()
    await expect(optionsPage.getByTestId('pat-input')).toBeVisible()

    // Reopening proves the token left chrome.storage.local, not just the React state.
    await optionsPage.close()
    const reopenedOptionsPage = await openOptions(context, extensionId)
    await expect(
      reopenedOptionsPage.getByText('Not connected', { exact: true }),
    ).toBeVisible()
    await expect(reopenedOptionsPage.getByTestId('pat-input')).toBeVisible()
  })

  test('points to Options and locks saving while no token is connected', async ({
    context,
    extensionId,
    page,
  }) => {
    // Arrange
    await page.goto('https://example.com')
    await page.waitForLoadState('domcontentloaded')

    // Act
    const popupPage = await openPopup(context, extensionId, {
      connected: false,
    })

    // Assert
    await expect(
      popupPage.getByRole('status').getByText('Not connected'),
    ).toBeVisible()
    await expect(
      popupPage.getByRole('button', { name: 'Open options' }),
    ).toBeVisible()
    await expect(popupPage.locator('.checkbox')).toBeDisabled()
    await expect(popupPage.locator('.checkbox')).not.toBeChecked()
  })
})
