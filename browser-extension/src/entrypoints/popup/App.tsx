import axios from 'axios'
import React, { useState } from 'react'

import { setBookmarkedIcon } from '../../lib/setBookmarkIcon'

import { useGetPageInfo } from './useGetPageInfo'

export interface PopupState {
  pageTitle: string
  url: string
}

function App() {
  const state = useGetPageInfo()
  const [comment, setComment] = useState('')

  const onCheckedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) return

    // Updated to use Vite's import.meta.env instead of process.env
    const apiUrl = import.meta.env.VITE_API_URL

    axios
      .post(apiUrl, {
        pageTitle: state.pageTitle,
        url: state.url.replace(/\/$/, ''),
      })
      .then(() => {
        const span = document.createElement('span')
        span.innerHTML = 'Success!'
        document.querySelector('.result')!.appendChild(span)

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
      .catch((err) => {
        const span = document.createElement('span')
        span.innerHTML = 'Failed...'
        document.querySelector('.result')!.appendChild(span)
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
          onBlur={(e) => setComment(e.target.value)}
          cols={60}
          rows={2}
        />
        <a
          className="twitter-btn"
          target="_blank"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            state.url.replace(/\/$/, ''),
          )}&text=${encodeURIComponent(comment)}`}
        >
          tweet
        </a>
        <div className="result"></div>
      </section>
    </main>
  )
}

export default App
