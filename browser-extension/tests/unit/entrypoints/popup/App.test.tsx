/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { describe, it, expect, beforeEach, vi } from 'vitest'

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
  it('shows the paste panel and hides connected status when no token is stored', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    stubActiveTab()

    // Act
    render(<App />)

    // Assert
    expect(await screen.findByTestId('pat-connect-panel')).toBeInTheDocument()
    expect(screen.queryByTestId('pat-connected-status')).not.toBeInTheDocument()
  })

  it('persists the pasted token to chrome.storage.local and reveals the connected state', async () => {
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

  it('attaches the token as a Bearer Authorization header on the save request', async () => {
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

  it('prompts to reconnect when the saved token is rejected with 401 on save', async () => {
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
