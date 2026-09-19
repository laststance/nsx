/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, beforeEach, vi } from 'vitest'

import App from '@/entrypoints/options/App'

const RAW_TOKEN = `nsx_pat_${'a'.repeat(60)}3f9a`

beforeEach(() => {
  vi.clearAllMocks()
  ;(chrome.storage.local.set as any).mockResolvedValue(undefined)
  ;(chrome.storage.local.remove as any).mockResolvedValue(undefined)
})

describe('Extension Options token connection', () => {
  test('offers the paste form with Connect locked when no token is stored', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})

    // Act
    render(<App />)

    // Assert
    expect(await screen.findByText('Not connected')).toBeVisible()
    expect(
      screen.getByLabelText(
        'Paste your NSX token to save pages from this extension.',
      ),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Connect' })).toBeDisabled()
    expect(
      screen.queryByRole('button', { name: 'Disconnect' }),
    ).not.toBeInTheDocument()
  })

  test('stores the pasted token and shows it masked as connected', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Not connected')

    // Act
    await user.type(screen.getByTestId('pat-input'), `  ${RAW_TOKEN}  `)
    await user.click(screen.getByRole('button', { name: 'Connect' }))

    // Assert — stored trimmed, and any rejected flag of the previous token is cleared in the same write.
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      nsx_pat: RAW_TOKEN,
      nsx_pat_rejected: false,
    })
    expect(await screen.findByText('Connected to NSX')).toBeVisible()
    expect(screen.getByText('nsx_pat_…3f9a')).toBeVisible()
    expect(screen.queryByTestId('pat-input')).not.toBeInTheDocument()
  })

  test('connects when Enter is pressed in the token field', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Not connected')

    // Act
    await user.type(screen.getByTestId('pat-input'), `${RAW_TOKEN}{Enter}`)

    // Assert
    expect(await screen.findByText('Connected to NSX')).toBeVisible()
  })

  test('refuses a truncated paste and keeps the extension disconnected', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Not connected')

    // Act — the last character of the token did not make it into the clipboard.
    await user.type(screen.getByTestId('pat-input'), RAW_TOKEN.slice(0, -1))
    await user.click(screen.getByRole('button', { name: 'Connect' }))

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "That doesn't look like an NSX token. Paste the whole nsx_pat_… value.",
    )
    expect(screen.getByTestId('pat-input')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(screen.getByTestId('pat-input')).toHaveValue(RAW_TOKEN.slice(0, -1))
    expect(screen.getByText('Not connected')).toBeVisible()
    expect(chrome.storage.local.set).not.toHaveBeenCalled()
  })

  test('withdraws the not-a-token warning once the pasted value is edited', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Not connected')
    await user.type(screen.getByTestId('pat-input'), 'my-github-token')
    await user.click(screen.getByRole('button', { name: 'Connect' }))
    await screen.findByRole('alert')

    // Act
    await user.clear(screen.getByTestId('pat-input'))

    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByTestId('pat-input')).toHaveAttribute(
      'aria-invalid',
      'false',
    )
  })

  test('shows the stored token masked, never in full, when already connected', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })

    // Act
    render(<App />)

    // Assert
    expect(await screen.findByText('Connected to NSX')).toBeVisible()
    expect(screen.getByText('nsx_pat_…3f9a')).toBeVisible()
    expect(screen.queryByText(RAW_TOKEN)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Disconnect' })).toBeVisible()
  })

  test('removes the stored token on Disconnect and returns to the paste form', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    const user = userEvent.setup()
    render(<App />)

    // Act
    await user.click(await screen.findByRole('button', { name: 'Disconnect' }))

    // Assert
    expect(chrome.storage.local.remove).toHaveBeenCalledWith([
      'nsx_pat',
      'nsx_pat_rejected',
    ])
    expect(await screen.findByText('Not connected')).toBeVisible()
    expect(screen.getByTestId('pat-input')).toBeVisible()
    expect(screen.queryByText('nsx_pat_…3f9a')).not.toBeInTheDocument()
  })

  test('asks for a new token when the popup found the stored token rejected', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({
      nsx_pat: RAW_TOKEN,
      nsx_pat_rejected: true,
    })

    // Act
    render(<App />)

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Your saved token was rejected. Paste a new token to reconnect.',
    )
    expect(screen.getByText('Token rejected')).toBeVisible()
    expect(screen.getByTestId('pat-input')).toBeVisible()
    expect(screen.queryByText('Connected to NSX')).not.toBeInTheDocument()
  })

  test('clears the rejected alert once a new token is connected', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({
      nsx_pat: `nsx_pat_${'b'.repeat(64)}`,
      nsx_pat_rejected: true,
    })
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('alert')

    // Act
    await user.type(screen.getByTestId('pat-input'), RAW_TOKEN)
    await user.click(screen.getByRole('button', { name: 'Connect' }))

    // Assert
    expect(await screen.findByText('Connected to NSX')).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('nsx_pat_…3f9a')).toBeVisible()
  })

  test('switches to the rejected state when the popup flags the token while this page is open', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    render(<App />)
    await screen.findByText('Connected to NSX')
    const [[notifyStorageChange]] = (
      chrome.storage.onChanged.addListener as any
    ).mock.calls
    ;(chrome.storage.local.get as any).mockResolvedValue({
      nsx_pat: RAW_TOKEN,
      nsx_pat_rejected: true,
    })

    // Act — the popup (another extension page) writes the rejected flag.
    await act(async () => {
      notifyStorageChange({ nsx_pat_rejected: { newValue: true } }, 'local')
    })

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Your saved token was rejected. Paste a new token to reconnect.',
    )
    expect(screen.queryByText('Connected to NSX')).not.toBeInTheDocument()
  })

  test('ignores storage changes that are not about the token', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({ nsx_pat: RAW_TOKEN })
    render(<App />)
    await screen.findByText('Connected to NSX')
    const [[notifyStorageChange]] = (
      chrome.storage.onChanged.addListener as any
    ).mock.calls

    // Act
    await act(async () => {
      notifyStorageChange({ unrelated_key: { newValue: 1 } }, 'local')
      notifyStorageChange({ nsx_pat: { newValue: 'x' } }, 'sync')
    })

    // Assert — only the read on mount happened.
    expect(chrome.storage.local.get).toHaveBeenCalledTimes(1)
  })

  test('does not flash the paste form while the stored token is still loading', () => {
    // Arrange — the storage read never settles.
    ;(chrome.storage.local.get as any).mockReturnValue(new Promise(() => {}))

    // Act
    render(<App />)

    // Assert
    expect(screen.queryByTestId('pat-input')).not.toBeInTheDocument()
    expect(screen.queryByText('Not connected')).not.toBeInTheDocument()
  })

  test('links to the NSX page where a token is generated', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})

    // Act
    render(<App />)

    // Assert
    expect(
      await screen.findByRole('link', {
        name: 'nsx.malloc.tokyo → Dashboard → Settings → Extension token',
      }),
    ).toHaveAttribute(
      'href',
      'https://nsx.malloc.tokyo/dashboard/settings/extension-token',
    )
  })

  test('stops listening for token changes when the page goes away', async () => {
    // Arrange
    ;(chrome.storage.local.get as any).mockResolvedValue({})
    const { unmount } = render(<App />)
    await screen.findByText('Not connected')
    const [[notifyStorageChange]] = (
      chrome.storage.onChanged.addListener as any
    ).mock.calls

    // Act
    unmount()

    // Assert
    expect(chrome.storage.onChanged.removeListener).toHaveBeenCalledWith(
      notifyStorageChange,
    )
  })
})
