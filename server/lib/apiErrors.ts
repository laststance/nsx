export type ApiErrorCode =
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'

type AppErrorOptions = {
  code: ApiErrorCode
  details?: unknown
  isOperational?: boolean
  message: string
  statusCode: number
}

/**
 * Describes an error that is safe for API middleware to map into JSON.
 * @example throw new AppError({ message: 'Post not found', statusCode: 404, code: 'NOT_FOUND' })
 */
export class AppError extends Error {
  public readonly code: ApiErrorCode
  public readonly details?: unknown
  public readonly isOperational: boolean
  public readonly statusCode: number

  public constructor({
    code,
    details,
    isOperational = true,
    message,
    statusCode,
  }: AppErrorOptions) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
    this.isOperational = isOperational
    this.statusCode = statusCode
  }
}

/**
 * Builds a 400 error for invalid API input.
 * @param message - Safe client-facing validation message.
 * @param details - Optional field-level validation metadata.
 * @returns AppError with validation status and code.
 * @example validationError('Invalid post id')
 */
export const validationError = (
  message: string,
  details?: unknown,
): AppError => {
  return new AppError({
    code: 'VALIDATION_ERROR',
    details,
    message,
    statusCode: 400,
  })
}

/**
 * Builds a 401 error for unauthenticated requests.
 * @param message - Safe client-facing authentication message.
 * @returns AppError with authentication status and code.
 * @example authenticationError('Authentication required')
 */
export const authenticationError = (
  message = 'Authentication required',
): AppError => {
  return new AppError({
    code: 'AUTHENTICATION_ERROR',
    message,
    statusCode: 401,
  })
}

/**
 * Builds a 403 error for authenticated users lacking permission.
 * @param message - Safe client-facing authorization message.
 * @returns AppError with authorization status and code.
 * @example authorizationError('Forbidden')
 */
export const authorizationError = (message = 'Forbidden'): AppError => {
  return new AppError({
    code: 'AUTHORIZATION_ERROR',
    message,
    statusCode: 403,
  })
}

/**
 * Builds a 404 error for missing API resources.
 * @param resourceName - Resource label used in the response message.
 * @returns AppError with not-found status and code.
 * @example notFoundError('Post')
 */
export const notFoundError = (resourceName = 'Resource'): AppError => {
  return new AppError({
    code: 'NOT_FOUND',
    message: `${resourceName} not found`,
    statusCode: 404,
  })
}

/**
 * Builds a 409 error for duplicate or conflicting API writes.
 * @param message - Safe client-facing conflict message.
 * @returns AppError with conflict status and code.
 * @example conflictError('Username already exists')
 */
export const conflictError = (message: string): AppError => {
  return new AppError({
    code: 'CONFLICT',
    message,
    statusCode: 409,
  })
}

/**
 * Converts unknown thrown values into a safe API error.
 * @param error - Unknown value caught by Express error middleware.
 * @returns Original AppError or a generic 500 wrapper.
 * @example toAppError(new Error('boom'))
 */
export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error

  return new AppError({
    code: 'INTERNAL_ERROR',
    isOperational: false,
    message: 'Internal Server Error',
    statusCode: 500,
  })
}
