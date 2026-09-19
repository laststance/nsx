import axios from 'axios'
import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
} from 'react'

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
import { useConnectionBar } from './useConnectionBar'
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
 * additive reconnect prompt without blocking the existing flow. While connected only a status dot
 * shows; clicking it unfolds the "Connected to NSX" bar that holds Disconnect.
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
  const connectionBar = useConnectionBar()
  // Escape hands focus back to the dot, because the collapsing bar turns inert under it.
  const statusDotRef = useRef<HTMLButtonElement | null>(null)
  const [comment, setComment] = useState<string>('')
  const [stockSaveState, setStockSaveState] = useState<StockSaveState>(
    INITIAL_STOCK_SAVE_STATE,
  )
  // Lets a save abort the in-flight existence check, whose late reply would reset the save result.
  const existenceCheckAbortControllerRef = useRef<AbortController | null>(null)
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

    const existenceCheckAbortController = new AbortController()
    existenceCheckAbortControllerRef.current = existenceCheckAbortController

    axios
      .get<StockExistsResponse>(
        buildStockExistsUrl(pushStockApiUrl, normalizedUrl),
        {
          ...buildStockRequestConfig(token),
          signal: existenceCheckAbortController.signal,
        },
      )
      .then(({ data }) => {
        if (existenceCheckAbortController.signal.aborted) return

        setStockSaveState({
          feedbackMessage: data.exists ? ALREADY_EXISTS_MESSAGE : '',
          isAlreadySaved: data.exists,
          isChecked: data.exists,
        })

        if (data.exists) setBookmarkedIcon()
      })
      .catch((error: unknown) => {
        // Aborted by cleanup or a save: the reply is stale, so the current state wins.
        if (existenceCheckAbortController.signal.aborted) return

        // A rejected stored token (revoked/expired) surfaces the reconnect prompt.
        if (token && isUnauthorizedResponse(error)) markRejected()

        // Existence check failures should not block saving a new page.
        setStockSaveState(INITIAL_STOCK_SAVE_STATE)
      })

    return () => {
      existenceCheckAbortController.abort()
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

    // The save supersedes a still-pending existence check; its "not saved" reply would erase Success!.
    existenceCheckAbortControllerRef.current?.abort()

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

  // Connected = a stored token the API has not rejected.
  const isConnected = token !== null && !needsReconnect
  // Wait for the stored token before offering the paste panel, or a connected popup opens tall and shrinks.
  const shouldShowPastePanel = !isTokenLoading && !isConnected
  const isConnectionBarOpen = isConnected && connectionBar.isOpen

  /**
   * Folds the open connection bar on Escape and hands focus back to the status dot.
   * @param event - Keydown bubbling up from anywhere in the popup.
   * @returns Nothing; with the bar closed the key falls through so Chrome closes the popup as usual.
   * @example
   * <main onKeyDown={onKeyDownHandler}>
   */
  const onKeyDownHandler = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key !== 'Escape' || !isConnectionBarOpen) return

    event.preventDefault()
    connectionBar.close()
    statusDotRef.current?.focus()
  }

  return (
    <main onKeyDown={onKeyDownHandler}>
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
              // Every new connection starts with the bar collapsed, even when the same token is pasted again.
              connectionBar.close()
              void connect()
            }}
          >
            Connect
          </button>
        </section>
      ) : null}

      {isConnected ? (
        // Stays mounted while collapsed so the fold animates both ways; inert keeps Disconnect out of reach.
        <div
          id="pat-connected-bar"
          className={
            isConnectionBarOpen
              ? 'pat-connected-reveal is-open'
              : 'pat-connected-reveal'
          }
          aria-hidden={!isConnectionBarOpen}
          inert={!isConnectionBarOpen}
        >
          <div className="pat-connected-reveal-inner">
            <section className="pat-connected" data-testid="pat-connected-bar">
              <span className="pat-connected-label">{CONNECTED_MESSAGE}</span>
              <button
                type="button"
                className="pat-disconnect-btn"
                data-testid="pat-disconnect-btn"
                onClick={(): void => {
                  connectionBar.close()
                  void disconnect()
                }}
              >
                Disconnect
              </button>
            </section>
          </div>
        </div>
      ) : null}

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
        {isConnected ? (
          // The only always-visible sign of the connection; opens the bar that holds Disconnect.
          <button
            ref={statusDotRef}
            type="button"
            className="pat-status-dot"
            data-testid="pat-connected-status"
            aria-controls="pat-connected-bar"
            aria-expanded={isConnectionBarOpen}
            aria-label={CONNECTED_MESSAGE}
            title={CONNECTED_MESSAGE}
            onClick={connectionBar.toggle}
          />
        ) : null}
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
          aria-label="Tweet comment"
          placeholder="Add a comment…"
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
