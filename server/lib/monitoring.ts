import type { RequestHandler } from 'express'
import {
  Counter,
  Histogram,
  collectDefaultMetrics,
  register,
} from 'prom-client'

import Logger from './Logger'
import { getCurrentRequestId } from './requestContext'

const METRIC_PREFIX = 'nsx_'
const HTTP_DURATION_BUCKETS_SECONDS = [
  0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10,
]
const NANOSECONDS_PER_SECOND = 1_000_000_000
const MILLISECONDS_PER_SECOND = 1_000
const SLOW_REQUEST_THRESHOLD_MS = 1_000

let didCollectDefaultMetrics = false

const httpRequestsTotal = new Counter({
  help: 'Total number of HTTP requests handled by the NSX API.',
  labelNames: ['method', 'route', 'status_code'],
  name: `${METRIC_PREFIX}http_requests_total`,
})

const httpRequestDurationSeconds = new Histogram({
  buckets: HTTP_DURATION_BUCKETS_SECONDS,
  help: 'Duration of HTTP requests handled by the NSX API in seconds.',
  labelNames: ['method', 'route', 'status_code'],
  name: `${METRIC_PREFIX}http_request_duration_seconds`,
})

/**
 * Starts collecting default Node.js metrics once per process.
 * @returns Nothing; metrics are registered in prom-client's global registry.
 * @example initializeMetrics()
 */
export const initializeMetrics = (): void => {
  if (didCollectDefaultMetrics) return

  collectDefaultMetrics({ prefix: METRIC_PREFIX })
  didCollectDefaultMetrics = true
}

/**
 * Resolves a low-cardinality route label for logs and Prometheus metrics.
 * @param req - Express request after a route has handled or missed it.
 * @returns Express route pattern when available, otherwise the request path.
 * @example resolveRouteLabel(req) // => '/api/post/:id'
 */
const resolveRouteLabel = (req: Parameters<RequestHandler>[0]): string => {
  const routePath =
    typeof req.route?.path === 'string' ? req.route.path : req.path

  return `${req.baseUrl}${routePath}`
}

/**
 * Converts high-resolution request duration into milliseconds and seconds.
 * @param startedAt - `process.hrtime.bigint()` value captured at request start.
 * @returns Duration in both milliseconds and seconds for logs and metrics.
 * @example getRequestDuration(process.hrtime.bigint())
 */
const getRequestDuration = (
  startedAt: bigint,
): { durationMs: number; durationSeconds: number } => {
  const durationNanoseconds = Number(process.hrtime.bigint() - startedAt)
  const durationSeconds = durationNanoseconds / NANOSECONDS_PER_SECOND

  return {
    durationMs: Math.round(durationSeconds * MILLISECONDS_PER_SECOND),
    durationSeconds,
  }
}

/**
 * Records every HTTP request as a JSON log line and Prometheus metric.
 * @param req - Incoming Express request.
 * @param res - Express response watched for completion.
 * @param next - Express continuation.
 * @returns Nothing; the request continues through Express middleware.
 * @example app.use(requestMonitoringMiddleware)
 */
export const requestMonitoringMiddleware: RequestHandler = (req, res, next) => {
  const startedAt = process.hrtime.bigint()

  res.on('finish', () => {
    const route = resolveRouteLabel(req)
    const statusCode = String(res.statusCode)
    const { durationMs, durationSeconds } = getRequestDuration(startedAt)

    httpRequestsTotal.labels(req.method, route, statusCode).inc()
    httpRequestDurationSeconds
      .labels(req.method, route, statusCode)
      .observe(durationSeconds)

    const logContext = {
      durationMs,
      method: req.method,
      requestId: getCurrentRequestId(),
      route,
      statusCode: res.statusCode,
      userAgent: req.get('user-agent'),
    }

    // Slow or failed requests need operator attention in aggregated logs.
    if (res.statusCode >= 500 || durationMs >= SLOW_REQUEST_THRESHOLD_MS) {
      Logger.warn('HTTP request completed', logContext)
      return
    }

    Logger.info('HTTP request completed', logContext)
  })

  next()
}

/**
 * Returns the Prometheus content type for `/api/metrics`.
 * @returns Prometheus text exposition content type.
 * @example getMetricsContentType()
 */
export const getMetricsContentType = (): string => {
  return register.contentType
}

/**
 * Serializes all registered Prometheus metrics for scraping.
 * @returns Prometheus text exposition payload.
 * @example await getMetricsPayload()
 */
export const getMetricsPayload = async (): Promise<string> => {
  return register.metrics()
}
