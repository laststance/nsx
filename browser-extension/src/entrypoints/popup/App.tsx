import axios from 'axios'
import React, { useEffect, useState, type ChangeEvent, type FC } from 'react'

import { setBookmarkedIcon } from '../../lib/setBookmarkIcon'

import {
  ALREADY_EXISTS_MESSAGE,
  FAILED_MESSAGE,
  FEEDBACK_CLEAR_DELAY_MS,
  SUCCESS_MESSAGE,
} from './constants'
import { useGetPageInfo } from './useGetPageInfo'
import { buildStockExistsUrl } from './utils/buildStockExistsUrl'
import { isConflictResponse } from './utils/isConflictResponse'
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
 * @returns The popup UI for saving the current tab and composing a tweet.
 * @example
 * <App />
 */
const App: FC = () => {
  const state = useGetPageInfo()
  const [comment, setComment] = useState<string>('')
  const [stockSaveState, setStockSaveState] = useState<StockSaveState>(
    INITIAL_STOCK_SAVE_STATE,
  )
  const normalizedUrl = normalizePopupUrl(state.url)

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL

    if (!apiUrl || !normalizedUrl) {
      setStockSaveState(INITIAL_STOCK_SAVE_STATE)
      return undefined
    }

    let isRequestCanceled = false

    axios
      .get<StockExistsResponse>(buildStockExistsUrl(apiUrl, normalizedUrl))
      .then(({ data }) => {
        if (isRequestCanceled) return

        setStockSaveState({
          feedbackMessage: data.exists ? ALREADY_EXISTS_MESSAGE : '',
          isAlreadySaved: data.exists,
          isChecked: data.exists,
        })

        if (data.exists) setBookmarkedIcon()
      })
      .catch(() => {
        if (isRequestCanceled) return

        // Existence check failures should not block saving a new page.
        setStockSaveState(INITIAL_STOCK_SAVE_STATE)
      })

    return () => {
      isRequestCanceled = true
    }
  }, [normalizedUrl])

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

    // Updated to use Vite's import.meta.env instead of process.env
    const apiUrl = import.meta.env.VITE_API_URL
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
      .post(apiUrl, {
        pageTitle: state.pageTitle,
        url: normalizedUrl,
      })
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

        setStockSaveState((currentState) => ({
          ...currentState,
          isChecked: false,
        }))
        showTemporaryFeedback(FAILED_MESSAGE)
        console.error(JSON.stringify(error))
      })
  }

  return (
    <main>
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
