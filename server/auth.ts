import type { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { TokenExpiredError } from 'jsonwebtoken'

import { verifyAccessToken } from './lib/JWT'
import Logger from './lib/Logger'
import { prisma } from './prisma'

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies.token as JWTtoken

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
      return next(createError(403, "User doesn't exist."))
    }
  } catch (error) {
    Logger.error('failed jwt.verify()')

    // Expired path
    if (error instanceof TokenExpiredError) {
      Logger.warn('Token expired')
      // Clear cookie
      res.cookie('token', '', { expires: new Date() })
      next(createError(401, 'Token expired. Please login again.'))
      return
    }

    Logger.error('Database Connection Error')
    Logger.error(error)

    // Clear cookie
    res.cookie('token', '', { expires: new Date() })
    return next(createError(500, 'Database Connection Error'))
  }
}
