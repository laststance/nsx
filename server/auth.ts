import type { Request, Response, NextFunction } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import { verifyAccessToken } from './lib/JWT'
import Logger from './lib/Logger'
import { prisma } from './prisma'

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
  const token = req.cookies.token as JWTtoken

  if (!token) {
    res.status(401).json({ error: 'No token found' })
    return
  }

  try {
    const decripted = verifyAccessToken(token) as User & { password: string }
    const user = await prisma.user.findFirst({
      where: {
        id: decripted.id,
        password: decripted.password,
      },
    })
    // JWT user exist
    if (user) {
      // Verified
      return next()
    } else {
      Logger.info(`decripted: ${JSON.stringify(decripted)}`)
      res.status(403).json({ error: "User doesn't exist." })
      return
    }
  } catch (error) {
    Logger.error('failed jwt.verify()')

    // Expired path
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      Logger.warn('Invalid or expired token')
      // Clear cookie
      res.cookie('token', '', { expires: new Date() })
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }

    Logger.error('Database Connection Error')
    Logger.error(error)

    // Clear cookie
    res.cookie('token', '', { expires: new Date() })
    res.status(500).json({ error: 'Database Connection Error' })
  }
}
