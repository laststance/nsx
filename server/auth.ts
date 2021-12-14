import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { assertIsDefined } from '../src/lib/assertIsDefined'
import shallowEqualScalar from '../src/lib/shallowEqualScalar'

import { cookieOptions } from './api'
import deleteJWTattribute from './lib/deleteJWTattribute'
import Logger from './lib/Logger'

export const verifyCertainAdmin = (
  req: Request,
  res: Response
): Response | void => {
  const token = req.cookies.token as JWTtoken
  if (token && req.body.author) {
    const requestBodyAuthor: IndexSignature<Author> = req.body.author
    let decriptedAuthor

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
      res.cookie('token', token, cookieOptions)
    } else {
      Logger.warn('shallowEqualScalar faild.')
      Logger.info(`decriptedAuthor: ${JSON.stringify(decriptedAuthor)}`)
      Logger.info(`requestBodyAuthor: ${JSON.stringify(requestBodyAuthor)}`)
      return res.status(403).json({ error: 'miss match token' })
    }
  } else {
    Logger.info('Access from unexped route')
    return res.status(403).json({ error: 'something wrong' })
  }
}
