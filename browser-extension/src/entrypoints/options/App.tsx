import React, { useState, type FC, type FormEvent } from 'react'

import {
  CONNECTED_MESSAGE,
  NOT_CONNECTED_MESSAGE,
  TOKEN_REJECTED_MESSAGE,
} from '../../lib/constants'
import {
  usePersonalAccessToken,
  type PatConnectionStatus,
} from '../../lib/usePersonalAccessToken'

import {
  CONNECT_PROMPT_MESSAGE,
  EXTENSION_TOKEN_SETTINGS_URL,
  INVALID_TOKEN_MESSAGE,
  RECONNECT_PROMPT_MESSAGE,
} from './constants'
import { maskPatToken } from './utils/maskPatToken'

const CONNECTION_STATE_LABELS: Record<
  Exclude<PatConnectionStatus, 'loading'>,
  string
> = {
  connected: CONNECTED_MESSAGE,
  disconnected: NOT_CONNECTED_MESSAGE,
  rejected: TOKEN_REJECTED_MESSAGE,
}

/**
 * Renders the extension's Options page, the one place where the NSX Personal Access Token is pasted, shown (masked) and removed.
 * Opened from the popup's "Open options" link, the toolbar icon's context menu, or chrome://extensions.
 * @returns The connection card: state line, then either the stored token with Disconnect or the paste form with Connect.
 * @example
 * <App />
 */
const App: FC = () => {
  const { token, connectionStatus, connect, disconnect } =
    usePersonalAccessToken()
  const [pastedToken, setPastedToken] = useState<string>('')
  const [isPastedTokenInvalid, setIsPastedTokenInvalid] =
    useState<boolean>(false)

  /**
   * Connects the pasted token when the form is submitted by the Connect button or the Enter key.
   * @param event - The paste form's submit event.
   * @returns Nothing; the hook stores the token and the card switches to the connected state, or the field is flagged when the value is not an NSX token.
   * @example
   * <form onSubmit={onConnectSubmit}>
   */
  const onConnectSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    void connect(pastedToken).then((isConnected) => {
      // Only a stored token clears the field; a refused value stays, flagged, until it is edited.
      if (isConnected) setPastedToken('')
      setIsPastedTokenInvalid(!isConnected)
    })
  }

  return (
    <main className="options">
      <h1 className="options-title">Reading List</h1>
      <p className="options-subtitle">Options</p>

      <section className="options-card" aria-labelledby="connection-heading">
        <h2 id="connection-heading" className="options-card-title">
          NSX connection
        </h2>

        {/* Nothing until the stored token is known, or a connected page would flash the paste form. */}
        {connectionStatus === 'loading' ? null : (
          <>
            <p
              className={`options-state is-${connectionStatus}`}
              data-testid="pat-connection-state"
            >
              {CONNECTION_STATE_LABELS[connectionStatus]}
            </p>

            {connectionStatus === 'rejected' ? (
              <p
                role="alert"
                className="options-alert"
                data-testid="pat-reconnect-notice"
              >
                {RECONNECT_PROMPT_MESSAGE}
              </p>
            ) : null}

            {connectionStatus === 'connected' && token !== null ? (
              <div className="options-row options-stored">
                <span className="options-token" data-testid="pat-stored-token">
                  {maskPatToken(token)}
                </span>
                <button
                  type="button"
                  className="options-btn is-secondary"
                  data-testid="pat-disconnect-btn"
                  onClick={(): void => void disconnect()}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <form className="options-form" onSubmit={onConnectSubmit}>
                <label className="options-label" htmlFor="pat-input">
                  {CONNECT_PROMPT_MESSAGE}
                </label>
                <div className="options-row">
                  <input
                    id="pat-input"
                    className="options-input"
                    data-testid="pat-input"
                    type="password"
                    value={pastedToken}
                    placeholder="nsx_pat_…"
                    autoComplete="off"
                    aria-invalid={isPastedTokenInvalid}
                    aria-describedby={
                      isPastedTokenInvalid ? 'pat-input-error' : undefined
                    }
                    onChange={(event): void => {
                      setPastedToken(event.target.value)
                      setIsPastedTokenInvalid(false)
                    }}
                  />
                  <button
                    type="submit"
                    className="options-btn"
                    data-testid="pat-connect-btn"
                    disabled={pastedToken.trim().length === 0}
                  >
                    Connect
                  </button>
                </div>
                {isPastedTokenInvalid ? (
                  <p
                    id="pat-input-error"
                    role="alert"
                    className="options-field-error"
                  >
                    {INVALID_TOKEN_MESSAGE}
                  </p>
                ) : null}
              </form>
            )}
          </>
        )}

        <p className="options-help">
          Generate a token at{' '}
          <a
            href={EXTENSION_TOKEN_SETTINGS_URL}
            target="_blank"
            rel="noreferrer"
          >
            nsx.malloc.tokyo → Dashboard → Settings → Extension token
          </a>
          . It is shown once; paste it here.
        </p>
      </section>
    </main>
  )
}

export default App
