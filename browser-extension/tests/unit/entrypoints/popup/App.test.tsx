/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

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
const UNAUTHORIZED_ERROR = { isAxiosError: true, response: { status: 401 } }

/**
 * Points chrome.tabs.query at one ordinary tab so useGetPageInfo resolves a saveable URL/title.
 * @param tab - The active tab; defaults to a page without a favicon.
 * @returns Nothing; configures the global chrome mock for the current test.
 */
const stubActiveTab = (tab: Record<string, string> = ACTIVE_TAB): void => {
  ;(chrome.tabs.query as any).mockResolvedValue([tab])
}

/**
 * Freezes setTimeout so a test can jump over the feedback hold; real time still ticks the fake clock,
 * which keeps Testing Library's findBy / waitFor polling alive.
 * @returns A user-event instance whose internal delays follow the fake clock.
 */
const setupUserWithFakeTimers = (): ReturnType<typeof userEvent.setup> => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  return userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
}

beforeEach(() => {
  vi.clearAllMocks()
  // Existence check resolves "not saved" by default so the save checkbox is enabled.
  ;(axios.get as any).mockResolvedValue({ data: { exists: false } })
  ;(chrome.storage.local.set as any).mockResolvedValue(undefined)
  ;(chrome.storage.local.remove as any).mockResolvedValue(undefined)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Extension popup token connection', () => {
  test('asks to open Options and locks the save checkbox when no token is stored', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    stubActiveTab()

    // Act
    render(<App />)

    // Assert
    expect(await screen.findByText('Not connected')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Open options' })).toBeVisible()
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  test('skips the duplicate check while no token is stored', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    stubActiveTab()

    // Act
    render(<App />)
    await screen.findByText('Not connected')

    // Assert — a tokenless check could only answer 401.
    expect(axios.get).not.toHaveBeenCalled()
  })

  test('opens the Options page from the Not connected notice', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)

    // Act
    await user.click(
      await screen.findByRole('button', { name: 'Open options' }),
    )

    // Assert
    expect(chrome.runtime.openOptionsPage).toHaveBeenCalledTimes(1)
  })

  test('shows no connection notice and unlocks the save checkbox when a token is stored', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    stubActiveTab()

    // Act
    render(<App />)

    // Assert
    await waitFor(() => expect(screen.getByRole('checkbox')).toBeEnabled())
    expect(screen.queryByText('Not connected')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Open options' }),
    ).not.toBeInTheDocument()
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

  test('shows Failed... first, then asks to reconnect, when the saved token is rejected with 401 on save', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    ;(axios.post as any).mockRejectedValue(UNAUTHORIZED_ERROR)
    stubActiveTab()
    const user = setupUserWithFakeTimers()
    render(<App />)
    const saveCheckbox = await screen.findByRole('checkbox')
    await waitFor(() => expect(saveCheckbox).toBeEnabled())

    // Act
    await user.click(saveCheckbox)

    // Assert — the failed save stays readable; the rejected token already locks the checkbox.
    expect(await screen.findByText('Failed...')).toBeVisible()
    expect(screen.queryByText('Token rejected')).not.toBeInTheDocument()
    expect(saveCheckbox).not.toBeChecked()
    expect(saveCheckbox).toBeDisabled()
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      nsx_pat_rejected: true,
    })

    // Act — the Failed... hold (1500ms) runs out.
    act(() => {
      vi.advanceTimersByTime(1600)
    })

    // Assert
    expect(screen.getByText('Token rejected')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Open options' })).toBeVisible()
  })

  test('asks to reconnect when the duplicate check answers 401 on open', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    ;(axios.get as any).mockRejectedValue(UNAUTHORIZED_ERROR)
    stubActiveTab()

    // Act
    render(<App />)

    // Assert
    expect(await screen.findByText('Token rejected')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Open options' })).toBeVisible()
    expect(screen.getByRole('checkbox')).toBeDisabled()
    // The flag in storage is what lets the Options page ask for a new token.
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      nsx_pat_rejected: true,
    })
  })

  test('keeps asking to reconnect on the next open without calling the API again', async () => {
    // Arrange — an earlier popup flagged this token as rejected.
    ;(chrome.storage.local.get as any).mockResolvedValue({
      nsx_pat: RAW_TOKEN,
      nsx_pat_rejected: true,
    })
    stubActiveTab()

    // Act
    render(<App />)

    // Assert
    expect(await screen.findByText('Token rejected')).toBeVisible()
    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(axios.get).not.toHaveBeenCalled()
  })

  test('does not flash the Not connected notice while the stored token is still loading', () => {
    // Arrange — the storage read never settles, so the popup stays in its loading state.
    ;(chrome.storage.local.get as any).mockReturnValue(new Promise(() => {}))
    stubActiveTab()

    // Act
    render(<App />)

    // Assert
    expect(screen.queryByText('Not connected')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Open options' }),
    ).not.toBeInTheDocument()
    // Saving stays locked until the token is known, so no tokenless save can slip out.
    expect(screen.getByRole('checkbox')).toBeDisabled()
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

  test('swaps the page domain for Success! and brings it back after the hold', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    ;(axios.post as any).mockResolvedValue({ data: {} })
    stubActiveTab()
    const user = setupUserWithFakeTimers()
    render(<App />)
    const saveCheckbox = await screen.findByRole('checkbox')
    await waitFor(() => expect(saveCheckbox).toBeEnabled())
    expect(screen.getByText('example.com')).toBeVisible()

    // Act
    await user.click(saveCheckbox)

    // Assert — Success! takes over the status slot.
    expect(await screen.findByText('Success!')).toBeVisible()
    expect(screen.getByText('example.com')).not.toBeVisible()

    // Act — 1000ms in, the 1500ms hold is still running.
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Assert
    expect(screen.getByText('Success!')).toBeVisible()

    // Act — the hold runs out.
    act(() => {
      vi.advanceTimersByTime(600)
    })

    // Assert — Success! stays mounted (it is fading out) but is hidden; the saved box stays checked.
    expect(screen.getByText('Success!')).not.toBeVisible()
    expect(screen.getByText('example.com')).toBeVisible()
    expect(saveCheckbox).toBeChecked()
  })

  test('keeps Already Exists up and the box locked for a page saved earlier', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    ;(axios.get as any).mockResolvedValue({ data: { exists: true } })
    stubActiveTab()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<App />)
    expect(await screen.findByText('Already Exists')).toBeVisible()

    // Act — well past the 1500ms hold that clears Success! and Failed...
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    // Assert
    expect(screen.getByText('Already Exists')).toBeVisible()
    expect(
      screen.getByRole('checkbox', { name: 'Already Exists' }),
    ).toBeChecked()
    expect(
      screen.getByRole('checkbox', { name: 'Already Exists' }),
    ).toBeDisabled()
  })

  test('shows Already Exists when the save answers 409', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    ;(axios.post as any).mockRejectedValue({
      isAxiosError: true,
      response: { status: 409 },
    })
    stubActiveTab()
    const user = userEvent.setup()
    render(<App />)
    const saveCheckbox = await screen.findByRole('checkbox')
    await waitFor(() => expect(saveCheckbox).toBeEnabled())

    // Act
    await user.click(saveCheckbox)

    // Assert
    expect(await screen.findByText('Already Exists')).toBeVisible()
    expect(saveCheckbox).toBeChecked()
    expect(saveCheckbox).toBeDisabled()
  })
})

describe('Extension popup status slot', () => {
  test('shows the page favicon and domain while there is nothing to report', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    stubActiveTab({
      favIconUrl: 'https://www.example.com/favicon.ico',
      title: 'Example Page',
      url: 'https://www.example.com/articles/1',
    })

    // Act
    const { container } = render(<App />)

    // Assert — the favicon is decorative (alt=""), so it has no accessible role to query by.
    expect(await screen.findByText('example.com')).toBeVisible()
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://www.example.com/favicon.ico',
    )
  })

  test('drops the favicon image when the site does not serve it', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    stubActiveTab({
      favIconUrl: 'https://example.com/missing.ico',
      title: 'Example Page',
      url: 'https://example.com',
    })
    const { container } = render(<App />)
    await screen.findByText('example.com')
    const favicon = container.querySelector('img')
    expect(favicon).toBeVisible()

    // Act
    fireEvent.error(favicon!)

    // Assert — no broken-image icon; the domain stays.
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(screen.getByText('example.com')).toBeVisible()
  })

  test('never points an image at a browser-internal favicon', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    stubActiveTab({
      favIconUrl: 'chrome://theme/IDR_EXTENSIONS_FAVICON',
      title: 'Example Page',
      url: 'https://example.com',
    })

    // Act
    const { container } = render(<App />)

    // Assert
    expect(await screen.findByText('example.com')).toBeVisible()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
