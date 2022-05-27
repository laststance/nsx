import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA, { ga } from 'react-ga'
import type { Metric } from 'web-vitals'

import App from './App'
import reportWebVitals from './reportWebVitals'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DNS,
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })

  ReactGA.initialize(process.env.VITE_GA_TRACKING_CODE as string)

  function sendToAnalytics({ id, name, value }: Metric) {
    ga('send', 'event', {
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
