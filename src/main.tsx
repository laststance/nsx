import * as Sentry from '@sentry/react'
import { createRoot } from 'react-dom/client'
import GA4 from 'react-ga4'
import type {
  CLSMetricWithAttribution,
  INPMetricWithAttribution,
  LCPMetricWithAttribution,
} from 'web-vitals/attribution'
import { onCLS, onINP, onLCP } from 'web-vitals/attribution'

import App from './App'
import type { EventParams } from './vite-env'

const REPLAYS_ON_ERROR_SAMPLE_RATE = 1.0
const REPLAYS_SESSION_SAMPLE_RATE = 0.1

/**
 * Reads the Sentry DSN while preserving the previous misspelled env variable.
 * @returns Configured browser DSN, or an empty string when Sentry is disabled.
 * @example getFrontendSentryDsn()
 */
const getFrontendSentryDsn = (): string => {
  return process.env.VITE_SENTRY_DSN || process.env.VITE_SENTRY_DNS || ''
}

if (process.env.NODE_ENV === 'production') {
  const sentryDsn = getFrontendSentryDsn()

  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NODE_ENV,
      integrations: [Sentry.replayIntegration()],
      release: process.env.VITE_SENTRY_RELEASE,

      // Capture the full session whenever a production error occurs.
      replaysOnErrorSampleRate: REPLAYS_ON_ERROR_SAMPLE_RATE,

      // Keep baseline replay sampling low enough for production traffic.
      replaysSessionSampleRate: REPLAYS_SESSION_SAMPLE_RATE,
    })
  }

  GA4.initialize(process.env.VITE_GA_MEASUREMENT_ID as string)
  function sendToGoogleAnalytics({
    id,
    name,
    attribution,
    delta,
    value,
  }:
    | CLSMetricWithAttribution
    | INPMetricWithAttribution
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
      case 'INP':
        eventParams.debug_target = attribution.interactionTarget
        break
      case 'LCP':
        eventParams.debug_target = attribution.elementRenderDelay
        break
    }

    // Assumes the global `gtag()` function exists, see:
    // https://developers.google.com/analytics/devguides/collection/ga4
    gtag('event', name, eventParams)
  }

  onCLS(sendToGoogleAnalytics)
  onINP(sendToGoogleAnalytics)
  onLCP(sendToGoogleAnalytics)
}

createRoot(document.getElementById('root')!).render(<App />)
