import pino from 'pino'
import type { Logger as PinoLogger } from 'pino'

import { getCurrentRequestId } from './requestContext'

export type LogContext = Record<string, unknown>

const REDACTED_VALUE = '[Redacted]'
const DEFAULT_LOG_LEVEL = 'info'
const SERVICE_NAME = 'nsx-api'

const REDACTED_LOG_PATHS = [
  'authorization',
  'cookie',
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'headers.authorization',
  'headers.cookie',
  'req.headers.authorization',
  'req.headers.cookie',
  'body.password',
  'body.token',
  'body.accessToken',
  'body.refreshToken',
  '*.password',
  '*.token',
  '*.accessToken',
  '*.refreshToken',
]

/**
 * Detects plain object metadata that can be attached to a structured log line.
 * @param value - Unknown log argument passed by callers.
 * @returns True when the value is a non-array object and not an Error.
 * @example isLogContext({ requestId: 'abc' }) // => true
 */
const isLogContext = (value: unknown): value is LogContext => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Error)
  )
}

/**
 * Converts arbitrary log arguments into a readable message fragment.
 * @param value - Unknown log argument that is not structured metadata.
 * @returns String safe for the `msg` field.
 * @example stringifyLogValue(404) // => '404'
 */
const stringifyLogValue = (value: unknown): string => {
  if (value instanceof Error) return value.message
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  try {
    return JSON.stringify(value)
  } catch {
    return '[Unserializable]'
  }
}

/**
 * Merges log metadata arguments into a single context object.
 * @param args - Extra log arguments after the primary message.
 * @returns Context fields plus compact `extra` values when arguments are scalar.
 * @example mergeLogContext([{ route: '/api' }, 500]) // => { route: '/api', extra: ['500'] }
 */
const mergeLogContext = (args: readonly unknown[]): LogContext => {
  const context: LogContext = {}
  const extraValues: string[] = []

  for (const arg of args) {
    // Metadata objects stay queryable in JSON logs.
    if (isLogContext(arg)) {
      Object.assign(context, arg)
      continue
    }

    if (arg instanceof Error) {
      context.err = arg
      continue
    }

    extraValues.push(stringifyLogValue(arg))
  }

  if (extraValues.length > 0) {
    context.extra = extraValues
  }

  return context
}

/**
 * Adds the async request ID to log metadata without overwriting explicit IDs.
 * @param context - Structured metadata collected from the caller.
 * @returns Metadata containing `requestId` when the log runs inside a request.
 * @example withRequestContext({ route: '/api/health' })
 */
const withRequestContext = (context: LogContext): LogContext => {
  const requestId = getCurrentRequestId()

  if (!requestId || context.requestId) {
    return context
  }

  return { ...context, requestId }
}

/**
 * Builds a pino call shape from the legacy logger arguments.
 * @param fallbackMessage - Message used when callers pass no string.
 * @param args - Logger arguments from existing route code.
 * @returns Message and metadata for a single JSON log line.
 * @example normalizeLogArguments('log', ['Saved', { id: 1 }])
 */
const normalizeLogArguments = (
  fallbackMessage: string,
  args: readonly unknown[],
): { context: LogContext; message: string } => {
  if (args.length === 0) {
    return { context: withRequestContext({}), message: fallbackMessage }
  }

  const [firstArg, ...restArgs] = args

  if (firstArg instanceof Error) {
    return {
      context: withRequestContext({
        ...mergeLogContext(restArgs),
        err: firstArg,
      }),
      message: firstArg.message || fallbackMessage,
    }
  }

  if (typeof firstArg === 'string') {
    return {
      context: withRequestContext(mergeLogContext(restArgs)),
      message: firstArg,
    }
  }

  const context = isLogContext(firstArg)
    ? mergeLogContext([firstArg, ...restArgs])
    : mergeLogContext(restArgs)

  if (!isLogContext(firstArg)) {
    context.value = stringifyLogValue(firstArg)
  }

  return {
    context: withRequestContext(context),
    message: fallbackMessage,
  }
}

/**
 * Structured JSON logger that preserves the previous `Logger.info(...)` API.
 * @returns A process-wide logger configured for pm2/stdout log aggregation.
 * @example Logger.info('Post created', { postId: 1 })
 */
class Logger {
  private readonly logger: PinoLogger

  public constructor() {
    this.logger = pino({
      base: {
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid,
        service: SERVICE_NAME,
      },
      level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
      redact: {
        censor: REDACTED_VALUE,
        paths: REDACTED_LOG_PATHS,
      },
      serializers: {
        err: pino.stdSerializers.err,
        error: pino.stdSerializers.err,
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    })
  }

  /**
   * Keeps the old color toggle API as a no-op because logs are now JSON.
   * @returns Nothing.
   * @example Logger.NoColor()
   */
  public NoColor(): void {}

  /**
   * Keeps the old prefix toggle API as a no-op because JSON has a `level`.
   * @returns Nothing.
   * @example Logger.NoPrefix()
   */
  public NoPrefix(): void {}

  /**
   * Keeps the old prefix toggle API as a no-op because JSON has a `level`.
   * @returns Nothing.
   * @example Logger.AddPrefix()
   */
  public AddPrefix(): void {}

  /**
   * Keeps the old color toggle API as a no-op because logs are now JSON.
   * @returns Nothing.
   * @example Logger.AddColor()
   */
  public AddColor(): void {}

  /**
   * Writes a generic informational log line.
   * @param args - Message and optional structured metadata.
   * @returns Nothing.
   * @example Logger.log('Server started', { port: 4000 })
   */
  public log(...args: unknown[]): void {
    const { context, message } = normalizeLogArguments('log', args)
    this.logger.info(context, message)
  }

  /**
   * Writes an informational log line.
   * @param args - Message and optional structured metadata.
   * @returns Nothing.
   * @example Logger.info('Request completed', { statusCode: 200 })
   */
  public info(...args: unknown[]): void {
    const { context, message } = normalizeLogArguments('info', args)
    this.logger.info(context, message)
  }

  /**
   * Writes a warning log line.
   * @param args - Message and optional structured metadata.
   * @returns Nothing.
   * @example Logger.warn('Invalid input', { field: 'title' })
   */
  public warn(...args: unknown[]): void {
    const { context, message } = normalizeLogArguments('warn', args)
    this.logger.warn(context, message)
  }

  /**
   * Writes an error log line.
   * @param args - Error, message, and optional structured metadata.
   * @returns Nothing.
   * @example Logger.error(new Error('Database failed'))
   */
  public error(...args: unknown[]): void {
    const { context, message } = normalizeLogArguments('error', args)
    this.logger.error(context, message)
  }

  /**
   * Writes a debug log line when `LOG_LEVEL=debug`.
   * @param args - Message and optional structured metadata.
   * @returns Nothing.
   * @example Logger.debug('Raw provider response', { provider: 'openai' })
   */
  public debug(...args: unknown[]): void {
    const { context, message } = normalizeLogArguments('debug', args)
    this.logger.debug(context, message)
  }
}

const logger: Logger = new Logger()

export default logger
