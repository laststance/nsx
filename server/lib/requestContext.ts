import { AsyncLocalStorage } from 'node:async_hooks'
import { randomUUID } from 'node:crypto'

import type { RequestHandler } from 'express'

export const REQUEST_ID_HEADER = 'x-request-id'

const REQUEST_ID_MAX_LENGTH = 128
const REQUEST_ID_PATTERN = /^[A-Za-z0-9_-]+$/

type RequestContext = {
  requestId: string
}

const requestContextStorage = new AsyncLocalStorage<RequestContext>()

/**
 * Reads a trusted request ID value from a client or proxy header.
 * @param headerValue - Raw Express header value.
 * @returns First non-empty request ID string, or undefined when absent.
 * @example getRequestIdFromHeader('abc-123') // => 'abc-123'
 */
const getRequestIdFromHeader = (headerValue: unknown): string | undefined => {
  if (typeof headerValue === 'string' && headerValue.trim()) {
    return headerValue.trim()
  }

  if (Array.isArray(headerValue)) {
    const firstHeaderValue = headerValue.find((value): value is string => {
      return typeof value === 'string' && Boolean(value.trim())
    })

    return firstHeaderValue?.trim()
  }

  return undefined
}

/**
 * Allows only header-safe request IDs before echoing them back to clients.
 * @param requestId - Candidate request ID from an inbound header.
 * @returns True when the value is short and contains only safe characters.
 * @example isValidRequestId('trace_abc-123') // => true
 */
const isValidRequestId = (requestId: string): boolean => {
  return (
    requestId.length <= REQUEST_ID_MAX_LENGTH &&
    REQUEST_ID_PATTERN.test(requestId)
  )
}

/**
 * Returns the request ID for logs emitted while handling the active request.
 * @returns Request ID from AsyncLocalStorage, or undefined outside requests.
 * @example getCurrentRequestId() // => 'f2c7...'
 */
export const getCurrentRequestId = (): string | undefined => {
  return requestContextStorage.getStore()?.requestId
}

/**
 * Creates and propagates request IDs for response headers, logs, and metrics.
 * @param req - Incoming Express request.
 * @param res - Express response where the request ID header is written.
 * @param next - Express continuation called inside the async request context.
 * @returns Nothing; the request continues through Express middleware.
 * @example app.use(requestContextMiddleware)
 */
export const requestContextMiddleware: RequestHandler = (req, res, next) => {
  const requestId = getRequestIdFromHeader(req.headers[REQUEST_ID_HEADER])
  const resolvedRequestId =
    requestId && isValidRequestId(requestId) ? requestId : randomUUID()

  req.headers[REQUEST_ID_HEADER] = resolvedRequestId
  res.setHeader(REQUEST_ID_HEADER, resolvedRequestId)

  requestContextStorage.run({ requestId: resolvedRequestId }, next)
}
