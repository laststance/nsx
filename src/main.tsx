import * as Sentry from '@sentry/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import { onCLS, onFID, onLCP } from 'web-vitals'
import type { Metric } from 'web-vitals'

import App from './App'

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

  function sendToGoogleAnalytics({ id, delta, name, value }: Metric) {
    // Assumes the global `gtag()` function exists, see:
    // https://developers.google.com/analytics/devguides/collection/ga4
    ReactGA.gtag('event', name, {
      // Optional.
      metric_delta: delta,

      // Use `delta` so the value can be summed.
      // Custom params:
      metric_id: id,

      // Needed to aggregate events.
      metric_value: value,

      // Built-in params:
      value: delta, // Optional.

      // OPTIONAL: any additional params or debug info here.
      // See: https://web.dev/debug-performance-in-the-field/
      // metric_rating: 'good' | 'needs-improvement' | 'poor',
      // debug_info: '...',
      // ...
    })
  }
  onCLS(sendToGoogleAnalytics)
  onFID(sendToGoogleAnalytics)
  onLCP(sendToGoogleAnalytics)
}

createRoot(document.getElementById('root')!).render(<App />)
