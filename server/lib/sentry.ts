import * as Sentry from '@sentry/node'
import type { Express } from 'express'

import Logger from './Logger'

const DEFAULT_TRACES_SAMPLE_RATE = 0.1

let didInitializeSentry = false

/**
 * Parses optional Sentry sample rate configuration from the environment.
 * @param rawValue - Raw `SENTRY_TRACES_SAMPLE_RATE` value.
 * @returns Number between 0 and 1, or the production-safe default.
 * @example parseTracesSampleRate('0.25') // => 0.25
 */
const parseTracesSampleRate = (rawValue: string | undefined): number => {
  if (!rawValue) return DEFAULT_TRACES_SAMPLE_RATE

  const parsedValue = Number(rawValue)

  if (Number.isNaN(parsedValue) || parsedValue < 0 || parsedValue > 1) {
    return DEFAULT_TRACES_SAMPLE_RATE
  }

  return parsedValue
}

/**
 * Initializes backend Sentry once when `SENTRY_DSN` is configured.
 * @returns True when Sentry is active for the current process.
 * @example initializeSentry()
 */
export const initializeSentry = (): boolean => {
  if (didInitializeSentry) return true

  const dsn = process.env.SENTRY_DSN

  if (!dsn) {
    return false
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.SENTRY_RELEASE || process.env.GITHUB_SHA,
    tracesSampleRate: parseTracesSampleRate(
      process.env.SENTRY_TRACES_SAMPLE_RATE,
    ),
  })

  didInitializeSentry = true
  Logger.info('Sentry backend error tracking initialized')

  return true
}

/**
 * Installs Sentry's Express error handler after application routes.
 * @param app - Express app receiving the Sentry error middleware.
 * @returns Nothing; no-op when Sentry is not configured.
 * @example setupSentryErrorHandler(app)
 */
export const setupSentryErrorHandler = (app: Express): void => {
  if (!didInitializeSentry) return

  Sentry.setupExpressErrorHandler(app)
}

/**
 * Captures an exception only when backend Sentry is active.
 * @param error - Unknown thrown value from application code.
 * @returns Nothing; no-op without `SENTRY_DSN`.
 * @example captureException(error)
 */
export const captureException = (error: unknown): void => {
  if (!didInitializeSentry) return

  Sentry.captureException(error)
}

initializeSentry()
