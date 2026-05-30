import type { Request, Response, NextFunction } from 'express'

import {
  authenticateRequestSession,
  authenticateStockPatToken,
} from './lib/authSession'
import Logger from './lib/Logger'

/**
 * Verifies the cookie JWT before protected API route handlers run.
 *
 * Mounted as Express middleware on write operations and external-provider
 * actions that require a logged-in user.
 *
 * @param req - Express request containing the `token` cookie.
 * @param res - Express response used for authentication failures.
 * @param next - Express continuation callback for authorized requests.
 * @returns Nothing; either calls `next()` or completes the response.
 * @example router.post('/tweet', isAuthorized, handler)
 */
export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await authenticateRequestSession(req, res)

    if (!session.ok) {
      res.status(session.status).json({ error: session.message })
      return
    }

    req.authenticatedUser = session.user
    return next()
  } catch (error) {
    Logger.error(error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}

/**
 * Authenticates an extension stock-write request via PAT (Bearer) or cookie session.
 *
 * Mounted on the extension-facing stock endpoints (`/push_stock`, `/stock/exists`).
 * Dispatches on the `Authorization` header: absent -> the unchanged cookie-session
 * middleware (so logged-in web requests behave exactly as before, the U7 guard);
 * present -> a PAT-only path that never reads or clears cookies, so an invalid PAT
 * cannot evict the owner's browser session (the U5 confused-deputy guard).
 *
 * @param req - Express request carrying `Authorization: Bearer nsx_pat_<raw>` or auth cookies.
 * @param res - Express response used for authentication failures.
 * @param next - Express continuation callback for authorized requests.
 * @returns Nothing; either calls `next()` or completes the response.
 * @example router.post('/push_stock', authenticateStockRequest, validateBody(schema), handler)
 */
export const authenticateStockRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // No bearer credential -> reuse the existing cookie-session middleware verbatim,
  // including its own cookie clearing on failure (U7 regression guard).
  if (req.headers.authorization === undefined) {
    return isAuthorized(req, res, next)
  }

  // Bearer present -> PAT path only. Cookie auth never runs here, so a bad PAT can
  // never clear the owner's auth cookies (U5 confused-deputy guard).
  try {
    const session = await authenticateStockPatToken(req.headers.authorization)

    if (!session.ok) {
      res.status(session.status).json({ error: session.message })
      return
    }

    req.authenticatedUser = session.user
    return next()
  } catch (error) {
    Logger.error(error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}
