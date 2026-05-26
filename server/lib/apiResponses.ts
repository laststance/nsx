import type { ErrorRequestHandler, Response } from 'express'

import type { AppError } from './apiErrors'
import { toAppError } from './apiErrors'
import Logger from './Logger'
import { getCurrentRequestId } from './requestContext'
import { captureException } from './sentry'

type PaginationMeta = {
  hasNext: boolean
  hasPrev: boolean
  page: number
  perPage: number
  total: number
  totalPages: number
}

type ApiSuccessResponse<T> = {
  data: T
  message?: string
  meta?: {
    pagination?: PaginationMeta
  }
  requestId?: string
  success: true
  timestamp: string
}

type ApiErrorResponse = {
  code: AppError['code']
  details?: unknown
  error: string
  requestId?: string
  success: false
  timestamp: string
}

type SendSuccessOptions = {
  message?: string
  meta?: ApiSuccessResponse<unknown>['meta']
  statusCode?: number
}

/**
 * Creates the shared response envelope fields for API v1 responses.
 * @returns Timestamp and request ID fields for response builders.
 * @example createResponseBase()
 */
const createResponseBase = (): {
  requestId?: string
  timestamp: string
} => {
  const requestId = getCurrentRequestId()

  return {
    ...(requestId ? { requestId } : {}),
    timestamp: new Date().toISOString(),
  }
}

/**
 * Sends a standardized successful API response.
 * @param res - Express response object.
 * @param data - Domain payload returned to the client.
 * @param options - Optional status, message, and metadata.
 * @returns Nothing; the response is completed.
 * @example sendSuccess(res, { userCount: 1 })
 */
export const sendSuccess = <T>(
  res: Response<ApiSuccessResponse<T>>,
  data: T,
  options: SendSuccessOptions = {},
): void => {
  const { message, meta, statusCode = 200 } = options

  res.status(statusCode).json({
    ...createResponseBase(),
    data,
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
    success: true,
  })
}

/**
 * Creates pagination metadata for list endpoints.
 * @param page - Current one-based page number.
 * @param perPage - Number of items requested per page.
 * @param total - Total matching row count.
 * @returns Stable pagination metadata for API v1 responses.
 * @example createPaginationMeta(1, 10, 25)
 */
export const createPaginationMeta = (
  page: number,
  perPage: number,
  total: number,
): PaginationMeta => {
  const totalPages = Math.ceil(total / perPage)

  return {
    hasNext: page < totalPages,
    hasPrev: page > 1,
    page,
    perPage,
    total,
    totalPages,
  }
}

/**
 * Sends a standardized API error response.
 * @param res - Express response object.
 * @param error - AppError already mapped to a safe client response.
 * @returns Nothing; the response is completed.
 * @example sendApiError(res, notFoundError('Post'))
 */
export const sendApiError = (
  res: Response<ApiErrorResponse>,
  error: AppError,
): void => {
  res.status(error.statusCode).json({
    ...createResponseBase(),
    code: error.code,
    ...(error.details ? { details: error.details } : {}),
    error: error.message,
    success: false,
  })
}

/**
 * Final Express API error middleware for standardized JSON failures.
 * @param error - Unknown error passed by Express.
 * @param req - Request that failed.
 * @param res - Response used to return the standardized error.
 * @param next - Express fallback used only when headers are already sent.
 * @returns Nothing; sends JSON unless Express has already started the response.
 * @example app.use('/api/v1', apiErrorHandler)
 */
export const apiErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res: Response<ApiErrorResponse>,
  next,
) => {
  if (res.headersSent) {
    next(error)
    return
  }

  const appError = toAppError(error)
  const logContext = {
    error,
    method: req.method,
    path: req.path,
    statusCode: appError.statusCode,
  }

  // Server errors are captured for operators; client errors are only logged.
  if (appError.statusCode >= 500) {
    Logger.error('API request failed', logContext)
    captureException(error)
  } else {
    Logger.warn('API request rejected', logContext)
  }

  sendApiError(res, appError)
}
