import { AsyncLocalStorage } from 'node:async_hooks'
import { randomUUID } from 'node:crypto'

import type { RequestHandler } from 'express'

export const REQUEST_ID_HEADER = 'x-request-id'

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
  const resolvedRequestId = requestId ?? randomUUID()

  req.headers[REQUEST_ID_HEADER] = resolvedRequestId
  res.setHeader(REQUEST_ID_HEADER, resolvedRequestId)

  requestContextStorage.run({ requestId: resolvedRequestId }, next)
}
