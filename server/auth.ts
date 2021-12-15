import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { assertIsDefined } from '../src/lib/assertIsDefined'
import shallowEqualScalar from '../src/lib/shallowEqualScalar'

import deleteJWTattribute from './lib/deleteJWTattribute'
import Logger from './lib/Logger'

export const verifyAuthorized = (
  req: Request,
  res: Response
  // next: NextFunction
): Response | boolean => {
  const token = req.cookies.token as JWTtoken
  if (token && req.body.author) {
    const requestBodyAuthor: IndexSignature<Author> = req.body.author
    let decriptedAuthor

    Logger.info('if (token && req.body.author) {')
    Logger.info('req.body.author: ' + JSON.stringify(req.body.author))
    Logger.info('req.cookies.token: ' + req.cookies.token)

    try {
      decriptedAuthor = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as IndexSignature<JWTpayload>
    } catch (error) {
      Logger.error(error)
      return res.status(200).json({ login: false })
    }
    assertIsDefined(decriptedAuthor)
    if (
      shallowEqualScalar(
        requestBodyAuthor,
        deleteJWTattribute(decriptedAuthor) as IndexSignature<JWTpayload>
      )
    ) {
      return true
    } else {
      Logger.warn('shallowEqualScalar faild.')
      Logger.info(`decriptedAuthor: ${JSON.stringify(decriptedAuthor)}`)
      Logger.info(`requestBodyAuthor: ${JSON.stringify(requestBodyAuthor)}`)
      res.status(403).json({ error: 'miss match token' })
      return false
    }
  } else {
    Logger.info('Access from unexped route')
    Logger.info('token: ' + token)
    Logger.info('req.cookies.token: ' + req.cookies.token)
    res.status(403).json({ error: 'false: token && req.body.author' })
    return false
  }
}
