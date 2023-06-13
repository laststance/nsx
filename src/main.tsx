import * as Sentry from '@sentry/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import type { Metric } from 'web-vitals'

import App from './App'
import reportWebVitals from './reportWebVitals'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DNS,

    integrations: [new Sentry.Replay()],

    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
  })

  ReactGA.initialize(process.env.VITE_GA_MEASUREMENT_ID as string)

  function sendToAnalytics({ id, name, value }: Metric) {
    ReactGA.ga('send', 'event', {
      eventAction: name,
      eventCategory: 'Web-Vitals',
      // values must be integers
      eventLabel: id,
      eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // id unique to current page load
      nonInteraction: true, // avoids affecting bounce rate
    })
  }
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals(sendToAnalytics)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
