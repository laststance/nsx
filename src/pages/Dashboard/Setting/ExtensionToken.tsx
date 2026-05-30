import React, { memo, useState } from 'react'

import Button from '@/src/components/Button'
import {
  useGetPersonalAccessTokensQuery,
  useMintPersonalAccessTokenMutation,
  useRevokePersonalAccessTokenMutation,
} from '@/src/redux/API'

/**
 * Masks a PAT for the list so a usable credential is never rendered.
 * @param tokenSuffix - The stored last-4 characters of the raw token.
 * @returns A masked label of the form `nsx_pat_…<suffix>`.
 * @example maskToken('abcd') // => 'nsx_pat_…abcd'
 */
const maskToken = (tokenSuffix: string): string => `nsx_pat_…${tokenSuffix}`

/**
 * Formats an ISO timestamp (or null) for the token list.
 * @param value - ISO date string, or null when the event never happened.
 * @returns A locale date string, or '—' when the value is null.
 * @example
 * formatTimestamp('2026-05-30T00:00:00.000Z') // => '5/30/2026' (locale-dependent)
 * formatTimestamp(null)                        // => '—'
 */
const formatTimestamp = (value: string | null): string =>
  value ? new Date(value).toLocaleDateString() : '—'

/**
 * Settings section that mints, reveals (once), lists, and revokes extension PATs (E13).
 *
 * Rendered under Settings → Extension Token. The owner generates a token here, copies
 * it once from the reveal panel, then pastes it into the browser extension. The list is
 * always masked; a failed mint/revoke keeps the form usable instead of losing state.
 */
const ExtensionToken: React.FC = memo(() => {
  const { data, isLoading } = useGetPersonalAccessTokensQuery()
  const [
    mintToken,
    { data: mintedToken, isLoading: isMinting, reset: resetMint },
  ] = useMintPersonalAccessTokenMutation()
  const [revokeToken, { isLoading: isRevoking }] =
    useRevokePersonalAccessTokenMutation()

  const [name, setName] = useState('')
  const [didCopy, setDidCopy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const tokens = data?.tokens ?? []

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault()
    setActionError(null)
    const trimmedName = name.trim()
    if (!trimmedName) return

    try {
      await mintToken({ name: trimmedName }).unwrap()
      // Keep the just-revealed token visible; only clear the input + stale copy flag.
      setName('')
      setDidCopy(false)
    } catch {
      // A failed mint leaves the form intact so the owner can retry (W3 guard).
      setActionError('Failed to generate token. Please try again.')
    }
  }

  const handleCopy = async () => {
    if (!mintedToken) return
    await navigator.clipboard.writeText(mintedToken.token)
    setDidCopy(true)
  }

  const handleDismissReveal = () => {
    setDidCopy(false)
    resetMint()
  }

  const handleRevoke = async (id: number) => {
    setActionError(null)
    try {
      await revokeToken({ id }).unwrap()
    } catch {
      setActionError('Failed to revoke token. Please try again.')
    }
  }

  return (
    <section
      data-testid="extension-token-setting"
      className="mx-auto w-full max-w-2xl"
    >
      <h1 className="text-color-primary text-center text-3xl">
        Extension Token
      </h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Generate a token, paste it into the browser extension, and it can save
        pages to your account. The raw token is shown only once.
      </p>

      {mintedToken ? (
        <div
          data-testid="token-reveal"
          className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4"
        >
          <p className="text-sm font-medium text-amber-800">
            Copy this token now — it will not be shown again.
          </p>
          <code
            data-testid="revealed-token"
            className="mt-2 block overflow-x-auto rounded bg-white px-3 py-2 font-mono text-sm break-all text-gray-800"
          >
            {mintedToken.token}
          </code>
          <div className="mt-3 flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCopy}
              data-testid="copy-token-btn"
            >
              {didCopy ? 'Copied!' : 'Copy'}
            </Button>
            <button
              type="button"
              onClick={handleDismissReveal}
              className="text-sm text-gray-500 underline hover:text-gray-700"
              data-testid="dismiss-reveal-btn"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleGenerate}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Token name (e.g. Chrome extension)"
            data-testid="token-name-input"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={isMinting || name.trim().length === 0}
            data-testid="generate-token-btn"
          >
            {isMinting ? 'Generating…' : 'Generate'}
          </Button>
        </form>
      )}

      {actionError ? (
        <p
          role="alert"
          data-testid="token-error"
          className="mt-3 text-sm text-red-600"
        >
          {actionError}
        </p>
      ) : null}

      <div className="mt-8">
        {isLoading ? (
          <p data-testid="token-list-loading" className="text-sm text-gray-500">
            Loading…
          </p>
        ) : tokens.length === 0 ? (
          <p data-testid="token-list-empty" className="text-sm text-gray-500">
            No tokens yet.
          </p>
        ) : (
          <ul data-testid="token-list" className="divide-y divide-gray-200">
            {tokens.map((token) => (
              <li
                key={token.id}
                data-testid={`token-row-${token.id}`}
                className="flex items-center justify-between py-3"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm text-gray-800">
                    {maskToken(token.tokenSuffix)}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {token.name}
                    <span
                      className={
                        token.revokedAt
                          ? 'ml-2 text-xs text-gray-400'
                          : 'ml-2 text-xs text-green-600'
                      }
                    >
                      {token.revokedAt ? 'Revoked' : 'Active'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Created {formatTimestamp(token.createdAt)} · Last used{' '}
                    {formatTimestamp(token.lastUsedAt)}
                  </p>
                </div>
                {token.revokedAt ? null : (
                  <button
                    type="button"
                    onClick={() => {
                      handleRevoke(token.id)
                    }}
                    disabled={isRevoking}
                    className="ml-4 shrink-0 text-sm text-red-600 underline hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid={`revoke-token-btn-${token.id}`}
                  >
                    Revoke
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
})
ExtensionToken.displayName = 'ExtensionToken'

export default ExtensionToken
