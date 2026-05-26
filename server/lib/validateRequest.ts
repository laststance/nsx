import type { RequestHandler } from 'express'
import type { ZodIssue, ZodType } from 'zod'

import Logger from './Logger'

type ValidationIssue = Res.ValidationIssue

/**
 * Formats a Zod issue path into a stable response field name.
 *
 * Called while building validation error responses for request bodies.
 *
 * @param path - Zod issue path from the failed schema parse.
 * @returns Dot-separated field name, or `body` for root-level errors.
 * @example formatIssuePath(['author', 'name']) // 'author.name'
 */
const formatIssuePath = (path: ZodIssue['path']): string => {
  if (path.length === 0) return 'body'
  return path.join('.')
}

/**
 * Converts Zod issues into the API's structured validation details.
 *
 * Called by `validateBody` after `safeParse` fails.
 *
 * @param issues - Zod validation issues from the failed parse.
 * @returns Stable issue objects safe to expose to API clients.
 * @example formatValidationIssues(error.issues)
 */
export const formatValidationIssues = (
  issues: readonly ZodIssue[],
): ValidationIssue[] =>
  issues.map((issue) => ({
    field: formatIssuePath(issue.path),
    message: issue.message,
    code: issue.code,
  }))

/**
 * Validates `req.body` with Zod before an Express route handler runs.
 *
 * The parsed value replaces `req.body`, so route handlers consume trimmed and
 * coerced data instead of raw client input.
 *
 * @param schema - Zod schema for the route request body.
 * @returns Express middleware that returns 400 on validation failure.
 * @example router.post('/create', validateBody(createPostBodySchema), handler)
 */
export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body)

    // Invalid client input returns a structured 400 without reaching Prisma.
    if (!result.success) {
      const details = formatValidationIssues(result.error.issues)
      Logger.warn('Request body validation failed', { details })
      res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details,
      })
      return
    }

    req.body = result.data
    next()
  }
