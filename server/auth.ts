import type { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { TokenExpiredError } from 'jsonwebtoken'

import shallowEqualScalar from '../lib/shallowEqualScalar'

import { deleteJWTattribute, verifyAccessToken } from './lib/JWT'
import Logger from './lib/Logger'

export const isAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies.token as JWTtoken
  if (!token || !req.body.author) {
    Logger.info('Access from unexped route')
    Logger.info('token: ' + token)
    Logger.info('req.cookies.token: ' + req.cookies.token)
    return next(createError(403, 'unauthorized'))
  }

  const author: IndexSignature<User> = req.body.author
  Logger.info('req.body.author: ' + JSON.stringify(req.body.author))
  Logger.info('req.cookies.token: ' + req.cookies.token)

  try {
    const decripted = verifyAccessToken(token)

    if (
      shallowEqualScalar(
        author,
        deleteJWTattribute(decripted) as IndexSignature<JWTpayload>,
      )
    ) {
      // Verified
      return next()
    } else {
      Logger.warn('shallowEqualScalar faild.')
      Logger.info(`decripted: ${JSON.stringify(decripted)}`)
      Logger.info(`author: ${JSON.stringify(author)}`)
      return next(createError(403, 'miss match token'))
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

    // Other error
    Logger.error('token error: ')
    Logger.error(error)

    // Clear cookie
    res.cookie('token', '', { expires: new Date() })
    return next(createError(401, 'Invalid token. Please login again.'))
  }
}
