import axios from 'axios'
import React, { useState, FC, ChangeEvent } from 'react'

import { setBookmarkedIcon } from '../../lib/setBookmarkIcon'

import { useGetPageInfo } from './useGetPageInfo'

export interface PopupState {
  pageTitle: string
  url: string
}

/**
 * Main popup component for NSX extension
 * Allows users to bookmark the current page and share on Twitter
 */
const App: FC = () => {
  const state = useGetPageInfo()
  const [comment, setComment] = useState<string>('')

  /**
   * Handles checkbox toggle to save current page
   * Sends page data to backend, updates icon, and shows success message
   */
  const onCheckedHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.checked) return

    // Updated to use Vite's import.meta.env instead of process.env
    const apiUrl = import.meta.env.VITE_API_URL

    axios
      .post(apiUrl, {
        pageTitle: state.pageTitle,
        url: state.url.replace(/\/$/, ''),
      })
      .then(() => {
        const resultElement = document.querySelector('.result')
        if (!resultElement) return

        const span = document.createElement('span')
        span.innerHTML = 'Success!'
        resultElement.appendChild(span)

        const fadeInEffect = new KeyframeEffect(
          span,
          [{ opacity: '0' }, { opacity: '1' }],
          {
            duration: 100,
            fill: 'forwards',
          },
        )

        const fadeInAnimation = new Animation(fadeInEffect, document.timeline)
        fadeInAnimation.play()

        setTimeout(() => {
          const fadeOutEffect = new KeyframeEffect(
            span,
            [{ opacity: '1' }, { opacity: '0' }],
            {
              duration: 100,
              fill: 'forwards',
            },
          )

          const fadeOutAnimation = new Animation(
            fadeOutEffect,
            document.timeline,
          )
          fadeOutAnimation.play()

          fadeOutAnimation.onfinish = () => {
            span.remove()
          }
        }, 1000)
      })
      .catch((err: unknown) => {
        const resultElement = document.querySelector('.result')
        if (!resultElement) return

        const span = document.createElement('span')
        span.innerHTML = 'Failed...'
        resultElement.appendChild(span)
        setTimeout(() => {
          span.remove()
        }, 1000)
        console.error(JSON.stringify(err))
      })
      .then(() => {
        setBookmarkedIcon()
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
        <div className="result" />
      </section>
    </main>
  )
}

export default App
