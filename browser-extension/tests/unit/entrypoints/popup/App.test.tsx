/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { describe, test, expect, beforeEach, vi } from 'vitest'

import App from '@/entrypoints/popup/App'

// Keep axios.isAxiosError real (isConflictResponse/isUnauthorizedResponse depend on it);
// only stub the network methods the popup calls.
vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>()
  return {
    ...actual,
    default: {
      ...actual.default,
      get: vi.fn(),
      post: vi.fn(),
      isAxiosError: actual.default.isAxiosError,
    },
  }
})

const RAW_TOKEN = `nsx_pat_${'a'.repeat(64)}`
const PUSH_STOCK_URL = 'http://localhost:4000/api/push_stock'
const ACTIVE_TAB = { url: 'https://example.com', title: 'Example Page' }

/**
 * Points chrome.tabs.query at one ordinary tab so useGetPageInfo resolves a saveable URL/title.
 * @returns Nothing; configures the global chrome mock for the current test.
 */
const stubActiveTab = (): void => {
  ;(chrome.tabs.query as any).mockResolvedValue([ACTIVE_TAB])
}

beforeEach(() => {
  vi.clearAllMocks()
  // Existence check resolves "not saved" by default so the save checkbox is enabled.
  ;(axios.get as any).mockResolvedValue({ data: { exists: false } })
  ;(chrome.storage.local.set as any).mockResolvedValue(undefined)
  ;(chrome.storage.local.remove as any).mockResolvedValue(undefined)
})

describe('Extension popup token connection', () => {
  test('shows the paste panel and hides connected status when no token is stored', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    stubActiveTab()

    // Act
    render(<App />)

    // Assert
    expect(await screen.findByTestId('pat-connect-panel')).toBeInTheDocument()
    expect(screen.queryByTestId('pat-connected-status')).not.toBeInTheDocument()
  })

  test('persists the pasted token to chrome.storage.local and reveals the connected state', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)
    await screen.findByTestId('pat-connect-panel')

    // Act
    await user.type(screen.getByTestId('pat-input'), RAW_TOKEN)
    await user.click(screen.getByTestId('pat-connect-btn'))

    // Assert
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      nsx_pat: RAW_TOKEN,
    })
    expect(
      await screen.findByTestId('pat-connected-status'),
    ).toBeInTheDocument()
  })

  test('attaches the token as a Bearer Authorization header on the save request', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    ;(axios.post as any).mockResolvedValue({ data: {} })
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)
    const saveCheckbox = await screen.findByRole('checkbox')
    await waitFor(() => expect(saveCheckbox).toBeEnabled())

    // Act
    await user.click(saveCheckbox)

    // Assert
    expect(axios.post).toHaveBeenCalledWith(
      PUSH_STOCK_URL,
      { pageTitle: 'Example Page', url: 'https://example.com' },
      { headers: { Authorization: `Bearer ${RAW_TOKEN}` } },
    )
  })

  test('prompts to reconnect when the saved token is rejected with 401 on save', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    ;(axios.post as any).mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 },
    })
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)
    const saveCheckbox = await screen.findByRole('checkbox')
    await waitFor(() => expect(saveCheckbox).toBeEnabled())

    // Act
    await user.click(saveCheckbox)

    // Assert — the reconnect alert and the paste panel both appear after the 401.
    expect(
      await screen.findByTestId('pat-reconnect-notice'),
    ).toBeInTheDocument()
    expect(screen.getByTestId('pat-connect-panel')).toBeInTheDocument()
  })
})

describe('Extension popup save result', () => {
  test('keeps Success! and the checked box when the on-open existence check answers after the save', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    ;(axios.post as any).mockResolvedValue({ data: {} })
    let answerExistenceCheck: (response: {
      data: { exists: boolean }
    }) => void = () => {}
    ;(axios.get as any).mockImplementation(
      (_url: string, config: { signal?: AbortSignal }) =>
        new Promise((resolve, reject) => {
          answerExistenceCheck = resolve
          // Like real axios, an aborted request rejects with CanceledError.
          config.signal?.addEventListener('abort', () => {
            reject(new axios.CanceledError())
          })
        }),
    )
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)
    const saveCheckbox = await screen.findByRole('checkbox')
    // The existence check started on open is still in flight when the user saves.
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))
    await user.click(saveCheckbox)
    expect(await screen.findByText('Success!')).toBeVisible()

    // Act — the existence check answers "not saved" only after the save succeeded.
    await act(async () => {
      answerExistenceCheck({ data: { exists: false } })
    })

    // Assert
    expect(screen.getByText('Success!')).toBeVisible()
    expect(saveCheckbox).toBeChecked()
  })
})

describe('Extension popup connection bar', () => {
  test('keeps the Connected to NSX bar collapsed when the popup opens connected', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    stubActiveTab()

    // Act
    render(<App />)

    // Assert — only the status dot shows; Disconnect stays out of reach.
    expect(
      await screen.findByRole('button', { name: 'Connected to NSX' }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('button', { name: 'Disconnect' }),
    ).not.toBeInTheDocument()
  })

  test('expands the Connected to NSX bar when the status dot is clicked', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)
    const statusDot = await screen.findByRole('button', {
      name: 'Connected to NSX',
    })

    // Act
    await user.click(statusDot)

    // Assert
    expect(statusDot).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Disconnect' })).toBeVisible()
  })

  test('collapses the expanded bar and refocuses the status dot on Escape', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)
    const statusDot = await screen.findByRole('button', {
      name: 'Connected to NSX',
    })
    await user.click(statusDot)
    await user.tab()

    // Act
    await user.keyboard('{Escape}')

    // Assert
    expect(statusDot).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('button', { name: 'Disconnect' }),
    ).not.toBeInTheDocument()
    expect(statusDot).toHaveFocus()
  })

  test('disconnects from the expanded bar and returns to the paste panel', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)
    await user.click(
      await screen.findByRole('button', { name: 'Connected to NSX' }),
    )

    // Act
    await user.click(screen.getByRole('button', { name: 'Disconnect' }))

    // Assert
    expect(chrome.storage.local.remove).toHaveBeenCalledWith('nsx_pat')
    expect(await screen.findByTestId('pat-connect-panel')).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'Connected to NSX' }),
    ).not.toBeInTheDocument()
  })

  test('starts collapsed again after reconnecting with the same token', async () => {
    // Arrange — open the bar, then disconnect from it.
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)
    await user.click(
      await screen.findByRole('button', { name: 'Connected to NSX' }),
    )
    await user.click(screen.getByRole('button', { name: 'Disconnect' }))
    await screen.findByTestId('pat-connect-panel')

    // Act
    await user.type(screen.getByTestId('pat-input'), RAW_TOKEN)
    await user.click(screen.getByTestId('pat-connect-btn'))

    // Assert
    expect(
      await screen.findByRole('button', { name: 'Connected to NSX' }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('button', { name: 'Disconnect' }),
    ).not.toBeInTheDocument()
  })

  test('does not flash the paste panel while the stored token is still loading', () => {
    // Arrange — the storage read never settles, so the popup stays in its loading state.
    ;(chrome.storage.local.get as any).mockReturnValue(new Promise(() => {}))
    stubActiveTab()

    // Act
    render(<App />)

    // Assert
    expect(screen.queryByTestId('pat-connect-panel')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Connected to NSX' }),
    ).not.toBeInTheDocument()
  })
})
