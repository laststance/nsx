import type { Request, Response, NextFunction } from 'express'

import { authenticateRequestSession } from './lib/authSession'
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
