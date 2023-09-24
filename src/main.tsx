import * as Sentry from '@sentry/react'
import { createRoot } from 'react-dom/client'
import GA4 from 'react-ga4'
import type {
  CLSMetricWithAttribution,
  FIDMetricWithAttribution,
  LCPMetricWithAttribution,
} from 'web-vitals/attribution'
import { onCLS, onFID, onLCP } from 'web-vitals/attribution'

import App from './App'
import type { EventParams } from './vite-env'

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

  GA4.initialize(process.env.VITE_GA_MEASUREMENT_ID as string)
  function sendToGoogleAnalytics({
    id,
    name,
    attribution,
    delta,
    value,
  }:
    | CLSMetricWithAttribution
    | FIDMetricWithAttribution
    | LCPMetricWithAttribution) {
    const eventParams: EventParams = {
      // Optional.
      metric_delta: delta,

      // Use `delta` so the value can be summed.
      // Custom params:
      metric_id: id,

      // Needed to aggregate events.
      metric_value: value,

      // Built-in params:
      value: delta, // Optional.
    }

    switch (name) {
      case 'CLS':
        eventParams.debug_target = attribution.largestShiftTarget
        break
      case 'FID':
        eventParams.debug_target = attribution.eventTarget
        break
      case 'LCP':
        eventParams.debug_target = attribution.element
        break
    }

    // Assumes the global `gtag()` function exists, see:
    // https://developers.google.com/analytics/devguides/collection/ga4
    gtag('event', name, eventParams)
  }

  onCLS(sendToGoogleAnalytics)
  onFID(sendToGoogleAnalytics)
  onLCP(sendToGoogleAnalytics)
}

createRoot(document.getElementById('root')!).render(<App />)
