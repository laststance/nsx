import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { H } from 'highlight.run'
import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)

if (process.env.NODE_ENV === 'production') {
  H.init(process.env.VITE_HIGHLIGHT_PROJECT_ID, {
    enableStrictPrivacy: false,
    environment: 'production',
  })

  Sentry.init({
    dsn: process.env.VITE_SENTRY_DNS,
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}
