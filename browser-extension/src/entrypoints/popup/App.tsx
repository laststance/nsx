import axios from 'axios'
import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
} from 'react'

import { openOptionsPage } from '../../lib/openOptionsPage'
import { setBookmarkedIcon } from '../../lib/setBookmarkIcon'
import { usePersonalAccessToken } from '../../lib/usePersonalAccessToken'

import PopupStatus from './PopupStatus'
import {
  ALREADY_EXISTS_MESSAGE,
  DEFAULT_API_ENDPOINT,
  FAILED_MESSAGE,
  FEEDBACK_CLEAR_DELAY_MS,
  SUCCESS_MESSAGE,
} from './constants'
import { useGetPageInfo } from './useGetPageInfo'
import { buildPushStockApiUrl } from './utils/buildPushStockApiUrl'
import { buildStockExistsUrl } from './utils/buildStockExistsUrl'
import { buildStockRequestConfig } from './utils/buildStockRequestConfig'
import { getDisplayDomain } from './utils/getDisplayDomain'
import {
  getPopupStatusMessage,
  type FeedbackMessage,
} from './utils/getPopupStatusMessage'
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
 * Authenticates stock reads/writes with the Personal Access Token connected on the Options page (Bearer
 * header). Without a usable token the save checkbox is disabled and the top-left status slot links to
 * the Options page; a rejected token (401) is flagged so that page asks for a new one.
 * @returns The popup UI for saving the current tab and composing a tweet.
 * @example
 * <App />
 */
const App: FC = () => {
  const state = useGetPageInfo()
  const { token, connectionStatus, markRejected } = usePersonalAccessToken()
  const [comment, setComment] = useState<string>('')
  const [stockSaveState, setStockSaveState] = useState<StockSaveState>(
    INITIAL_STOCK_SAVE_STATE,
  )
  // Lets a save abort the in-flight existence check, whose late reply would reset the save result.
  const existenceCheckAbortControllerRef = useRef<AbortController | null>(null)
  const normalizedUrl = normalizePopupUrl(state.url)

  useEffect(() => {
    // Only a connected token can answer the existence check; without one the API would just reply 401.
    // Also waits for the stored token to load.
    if (connectionStatus !== 'connected') {
      // A sticky Already Exists would outrank the connection notice and hide its Open options link, so it goes
      // with the token. Failed... from a save that found the token rejected still fades out on its own.
      setStockSaveState((currentState) =>
        currentState.isAlreadySaved ? INITIAL_STOCK_SAVE_STATE : currentState,
      )
      return undefined
    }

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

        // A rejected stored token (revoked/expired) surfaces the reconnect notice.
        if (isUnauthorizedResponse(error)) markRejected()

        // Existence check failures should not block saving a new page.
        setStockSaveState(INITIAL_STOCK_SAVE_STATE)
      })

    return () => {
      existenceCheckAbortController.abort()
    }
  }, [normalizedUrl, token, connectionStatus, markRejected])

  /**
   * Shows a temporary result message after save attempts complete.
   * @param message - The feedback text to display in the status slot.
   * @returns Nothing; React state controls when the message fades in and back out.
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

        // A rejected stored token brings up the reconnect notice once the Failed result has faded out.
        if (isUnauthorizedResponse(error)) markRejected()

        setStockSaveState((currentState) => ({
          ...currentState,
          isChecked: false,
        }))
        showTemporaryFeedback(FAILED_MESSAGE)
        logStockRequestError(error)
      })
  }

  return (
    <main>
      <PopupStatus
        domain={getDisplayDomain(state.url)}
        message={getPopupStatusMessage(
          stockSaveState.feedbackMessage,
          connectionStatus,
        )}
        onOpenOptions={openOptionsPage}
      />
      <section className="row1">
        <div className="title" title={state.pageTitle}>
          {state.pageTitle}
        </div>
        <input
          className="checkbox"
          aria-label={
            stockSaveState.isAlreadySaved
              ? 'Already Exists'
              : 'Save current page to NSX'
          }
          checked={stockSaveState.isChecked}
          // Saving needs a usable token, which is connected on the Options page.
          disabled={
            connectionStatus !== 'connected' ||
            stockSaveState.isAlreadySaved ||
            !normalizedUrl
          }
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
          Tweet
        </a>
      </section>
    </main>
  )
}

export default App
