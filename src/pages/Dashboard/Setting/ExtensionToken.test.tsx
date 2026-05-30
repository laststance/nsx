import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import TestRenderer from '@/src/lib/TestRenderer'
import { API } from '@/src/redux/API'
import { store } from '@/src/redux/store'

import { server } from '../../../../mocks/server'

import ExtensionToken from './ExtensionToken'

const RAW_TOKEN = `nsx_pat_${'a'.repeat(64)}`

const LIST_URL = 'http://*/api/personal_access_token/list'
const MINT_URL = 'http://*/api/personal_access_token'

/**
 * Registers an MSW handler that returns the given token list for the list query.
 * @param tokens - Masked token rows to serve from GET /personal_access_token/list.
 * @returns Nothing; the handler is added for the current test only.
 * @example respondWithTokenList([])
 */
const respondWithTokenList = (tokens: Res.PersonalAccessToken[]): void => {
  server.use(http.get(LIST_URL, () => HttpResponse.json({ tokens })))
}

beforeEach(() => {
  // Fresh RTK Query cache per test so a prior test's list/mint result never bleeds in.
  store.dispatch(API.util.resetApiState())
})

describe('ExtensionToken settings section', () => {
  it('reveals the freshly minted raw token once after generating', async () => {
    // Arrange
    respondWithTokenList([])
    server.use(
      http.post(MINT_URL, () =>
        HttpResponse.json(
          {
            id: 1,
            name: 'Chrome extension',
            tokenSuffix: 'aaaa',
            createdAt: '2026-05-30T00:00:00.000Z',
            token: RAW_TOKEN,
          },
          { status: 201 },
        ),
      ),
    )
    const user = userEvent.setup()
    TestRenderer(<ExtensionToken />)

    // Act
    await user.type(screen.getByTestId('token-name-input'), 'Chrome extension')
    await user.click(screen.getByTestId('generate-token-btn'))

    // Assert
    expect(await screen.findByTestId('revealed-token')).toHaveTextContent(
      RAW_TOKEN,
    )
  })

  it('copies the revealed token to the clipboard and confirms inline', async () => {
    // Arrange
    respondWithTokenList([])
    server.use(
      http.post(MINT_URL, () =>
        HttpResponse.json(
          {
            id: 1,
            name: 'Chrome extension',
            tokenSuffix: 'aaaa',
            createdAt: '2026-05-30T00:00:00.000Z',
            token: RAW_TOKEN,
          },
          { status: 201 },
        ),
      ),
    )
    const writeText = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    // jsdom exposes navigator.clipboard as a getter-only accessor, so redefine it with
    // a concrete spy the component's handler can call.
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    TestRenderer(<ExtensionToken />)
    await user.type(screen.getByTestId('token-name-input'), 'Chrome extension')
    await user.click(screen.getByTestId('generate-token-btn'))
    await screen.findByTestId('revealed-token')

    // Act
    await user.click(screen.getByTestId('copy-token-btn'))

    // Assert
    expect(writeText).toHaveBeenCalledWith(RAW_TOKEN)
    expect(await screen.findByText('Copied!')).toBeInTheDocument()
  })

  it('lists existing tokens masked as nsx_pat_…suffix, never the raw value', async () => {
    // Arrange
    respondWithTokenList([
      {
        id: 1,
        name: 'Chrome extension',
        tokenSuffix: 'wxyz',
        createdAt: '2026-05-30T00:00:00.000Z',
        lastUsedAt: null,
        revokedAt: null,
      },
    ])
    TestRenderer(<ExtensionToken />)

    // Act
    const maskedLabel = await screen.findByText('nsx_pat_…wxyz')

    // Assert — only the masked label is shown; no reveal panel, but a revoke control exists.
    expect(maskedLabel).toBeInTheDocument()
    expect(screen.getByTestId('revoke-token-btn-1')).toBeInTheDocument()
    expect(screen.queryByTestId('revealed-token')).not.toBeInTheDocument()
  })

  it('keeps the form and its input when generation fails with a 5xx', async () => {
    // Arrange
    respondWithTokenList([])
    server.use(
      http.post(MINT_URL, () =>
        HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 }),
      ),
    )
    const user = userEvent.setup()
    TestRenderer(<ExtensionToken />)

    // Act
    await user.type(screen.getByTestId('token-name-input'), 'My token')
    await user.click(screen.getByTestId('generate-token-btn'))

    // Assert — an error is shown, no token is revealed, and the typed name is preserved.
    expect(await screen.findByTestId('token-error')).toBeInTheDocument()
    expect(screen.queryByTestId('revealed-token')).not.toBeInTheDocument()
    expect(screen.getByTestId('token-name-input')).toHaveValue('My token')
  })
})
