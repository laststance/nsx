import axios from 'axios'
import React, { useEffect, useState, type ChangeEvent, type FC } from 'react'

import { setBookmarkedIcon } from '../../lib/setBookmarkIcon'

import {
  ALREADY_EXISTS_MESSAGE,
  CONNECT_PROMPT_MESSAGE,
  CONNECTED_MESSAGE,
  DEFAULT_API_ENDPOINT,
  FAILED_MESSAGE,
  FEEDBACK_CLEAR_DELAY_MS,
  RECONNECT_PROMPT_MESSAGE,
  SUCCESS_MESSAGE,
} from './constants'
import { useGetPageInfo } from './useGetPageInfo'
import { usePersonalAccessToken } from './usePersonalAccessToken'
import { buildPushStockApiUrl } from './utils/buildPushStockApiUrl'
import { buildStockExistsUrl } from './utils/buildStockExistsUrl'
import { buildStockRequestConfig } from './utils/buildStockRequestConfig'
import { isConflictResponse } from './utils/isConflictResponse'
import { isUnauthorizedResponse } from './utils/isUnauthorizedResponse'
import { logStockRequestError } from './utils/logStockRequestError'
import { normalizePopupUrl } from './utils/normalizePopupUrl'

export interface PopupState {
  pageTitle: string
  url: string
}

interface StockExistsResponse {
  exists: boolean
}

type FeedbackMessage =
  | ''
  | typeof ALREADY_EXISTS_MESSAGE
  | typeof FAILED_MESSAGE
  | typeof SUCCESS_MESSAGE

type StockSaveState = {
  feedbackMessage: FeedbackMessage
  isAlreadySaved: boolean
  isChecked: boolean
}

const INITIAL_STOCK_SAVE_STATE: StockSaveState = {
  feedbackMessage: '',
  isAlreadySaved: false,
  isChecked: false,
}

/**
 * Renders the NSX extension popup and coordinates duplicate-aware page saves.
 *
 * Authenticates stock reads/writes with a pasted Personal Access Token (Bearer header); the save
 * checkbox stays usable whether or not a token is connected, and a rejected token (401) reveals an
 * additive reconnect prompt without blocking the existing flow.
 * @returns The popup UI for connecting a token, saving the current tab, and composing a tweet.
 * @example
 * <App />
 */
const App: FC = () => {
  const state = useGetPageInfo()
  const {
    token,
    isLoading: isTokenLoading,
    needsReconnect,
    inputToken,
    setInputToken,
    connect,
    disconnect,
    markRejected,
  } = usePersonalAccessToken()
  const [comment, setComment] = useState<string>('')
  const [stockSaveState, setStockSaveState] = useState<StockSaveState>(
    INITIAL_STOCK_SAVE_STATE,
  )
  const normalizedUrl = normalizePopupUrl(state.url)

  useEffect(() => {
    // Wait until the stored token is known so the existence check carries the Bearer header.
    if (isTokenLoading) return undefined

    const pushStockApiUrl = buildPushStockApiUrl(
      import.meta.env.VITE_API_ENDPOINT || DEFAULT_API_ENDPOINT,
    )

    if (!normalizedUrl) {
      setStockSaveState(INITIAL_STOCK_SAVE_STATE)
      return undefined
    }

    let isRequestCanceled = false

    axios
      .get<StockExistsResponse>(
        buildStockExistsUrl(pushStockApiUrl, normalizedUrl),
        buildStockRequestConfig(token),
      )
      .then(({ data }) => {
        if (isRequestCanceled) return

        setStockSaveState({
          feedbackMessage: data.exists ? ALREADY_EXISTS_MESSAGE : '',
          isAlreadySaved: data.exists,
          isChecked: data.exists,
        })

        if (data.exists) setBookmarkedIcon()
      })
      .catch((error: unknown) => {
        if (isRequestCanceled) return

        // A rejected stored token (revoked/expired) surfaces the reconnect prompt.
        if (token && isUnauthorizedResponse(error)) markRejected()

        // Existence check failures should not block saving a new page.
        setStockSaveState(INITIAL_STOCK_SAVE_STATE)
      })

    return () => {
      isRequestCanceled = true
    }
  }, [normalizedUrl, token, isTokenLoading, markRejected])

  /**
   * Shows a temporary result message after save attempts complete.
   * @param message - The feedback text to display in the result area.
   * @returns Nothing; React state controls when the message appears and clears.
   * @example
   * showTemporaryFeedback(SUCCESS_MESSAGE)
   */
  const showTemporaryFeedback = (message: FeedbackMessage): void => {
    setStockSaveState((currentState) => ({
      ...currentState,
      feedbackMessage: message,
    }))

    window.setTimeout(() => {
      setStockSaveState((currentState) =>
        currentState.feedbackMessage === message
          ? { ...currentState, feedbackMessage: '' }
          : currentState,
      )
    }, FEEDBACK_CLEAR_DELAY_MS)
  }

  /**
   * Saves the current page when the popup checkbox is checked.
   * @param event - The checkbox change event from the popup UI.
   * @returns Nothing; API responses update checkbox, icon, and feedback state.
   * @example
   * onCheckedHandler(event)
   */
  const onCheckedHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event.target.checked) {
      setStockSaveState((currentState) => ({
        ...currentState,
        isChecked: false,
      }))
      return
    }

    // Vite injects the shared endpoint during builds; E2E falls back to localhost.
    const pushStockApiUrl = buildPushStockApiUrl(
      import.meta.env.VITE_API_ENDPOINT || DEFAULT_API_ENDPOINT,
    )
    setStockSaveState((currentState) => ({
      ...currentState,
      isChecked: true,
    }))

    if (stockSaveState.isAlreadySaved) {
      setStockSaveState((currentState) => ({
        ...currentState,
        feedbackMessage: ALREADY_EXISTS_MESSAGE,
      }))
      setBookmarkedIcon()
      return
    }

    axios
      .post(
        pushStockApiUrl,
        {
          pageTitle: state.pageTitle,
          url: normalizedUrl,
        },
        buildStockRequestConfig(token),
      )
      .then(() => {
        showTemporaryFeedback(SUCCESS_MESSAGE)
        setBookmarkedIcon()
      })
      .catch((error: unknown) => {
        if (isConflictResponse(error)) {
          setStockSaveState({
            feedbackMessage: ALREADY_EXISTS_MESSAGE,
            isAlreadySaved: true,
            isChecked: true,
          })
          setBookmarkedIcon()
          return
        }

        // A rejected stored token reveals the reconnect prompt without hiding the Failed result.
        if (token && isUnauthorizedResponse(error)) markRejected()

        setStockSaveState((currentState) => ({
          ...currentState,
          isChecked: false,
        }))
        showTemporaryFeedback(FAILED_MESSAGE)
        logStockRequestError(error)
      })
  }

  // Show the paste panel before connecting, or after a stored token is rejected.
  const shouldShowPastePanel = !token || needsReconnect

  return (
    <main>
      {shouldShowPastePanel ? (
        <section className="pat-connect" data-testid="pat-connect-panel">
          <label className="pat-connect-label" htmlFor="pat-input">
            {CONNECT_PROMPT_MESSAGE}
          </label>
          <input
            id="pat-input"
            className="pat-input"
            data-testid="pat-input"
            type="password"
            value={inputToken}
            placeholder="nsx_pat_…"
            aria-label="NSX extension token"
            onChange={(event): void => setInputToken(event.target.value)}
          />
          <button
            type="button"
            className="pat-connect-btn"
            data-testid="pat-connect-btn"
            disabled={inputToken.trim().length === 0}
            onClick={(): void => {
              void connect()
            }}
          >
            Connect
          </button>
        </section>
      ) : (
        <section className="pat-connected" data-testid="pat-connected-status">
          <span className="pat-connected-label">{CONNECTED_MESSAGE}</span>
          <button
            type="button"
            className="pat-disconnect-btn"
            data-testid="pat-disconnect-btn"
            onClick={(): void => {
              void disconnect()
            }}
          >
            Disconnect
          </button>
        </section>
      )}

      {needsReconnect ? (
        <p
          role="alert"
          className="pat-reconnect-notice"
          data-testid="pat-reconnect-notice"
        >
          {RECONNECT_PROMPT_MESSAGE}
        </p>
      ) : null}

      <section className="row1">
        <div className="title">
          {state.pageTitle.length ? state.pageTitle : ''}
        </div>
        <input
          className="checkbox"
          aria-label={
            stockSaveState.isAlreadySaved
              ? 'Already Exists'
              : 'Save current page to NSX'
          }
          checked={stockSaveState.isChecked}
          disabled={stockSaveState.isAlreadySaved || !normalizedUrl}
          type="checkbox"
          onChange={onCheckedHandler}
        />
      </section>
      <section className="row2">
        <textarea
          className="comment"
          onBlur={(e): void => setComment(e.currentTarget.value)}
          cols={60}
          rows={2}
        />
        <a
          className="twitter-btn"
          target="_blank"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            state.url.replace(/\/$/, ''),
          )}&text=${encodeURIComponent(comment)}`}
          rel="noreferrer"
        >
          tweet
        </a>
        <div className="result">
          {stockSaveState.feedbackMessage ? (
            <span>{stockSaveState.feedbackMessage}</span>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export default App
