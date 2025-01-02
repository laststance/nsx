import type { Request, Response } from 'express'

import { assertIsDefined } from '../lib/assertIsDefined'
import shallowEqualScalar from '../lib/shallowEqualScalar'

import deleteJWTattribute from './lib/deleteJWTattribute'
import Logger from './lib/Logger'
import { verifyAccessToken } from './lib/JWT'

export const isAuthorized = (req: Request, res: Response): true | void => {
  const token = req.cookies.token as JWTtoken
  if (token && req.body.author) {
    const author: IndexSignature<Author> = req.body.author
    let decripted

    Logger.info('if (token && req.body.author) {')
    Logger.info('req.body.author: ' + JSON.stringify(req.body.author))
    Logger.info('req.cookies.token: ' + req.cookies.token)

    try {
      decripted = verifyAccessToken(token)
    } catch (error) {
      Logger.error('failed jwt.verify()')
      Logger.error('decripted ' + JSON.stringify(decripted))
      Logger.error('token: ')
      Logger.error(error)
    }
    assertIsDefined(decripted)
    if (
      shallowEqualScalar(
        author,
        deleteJWTattribute(decripted) as IndexSignature<JWTpayload>,
      )
    ) {
      // Verified
      return true
    } else {
      Logger.warn('shallowEqualScalar faild.')
      Logger.info(`decripted: ${JSON.stringify(decripted)}`)
      Logger.info(`author: ${JSON.stringify(author)}`)
      res.status(403).json({ error: 'miss match token' })
    }
  } else {
    Logger.info('Access from unexped route')
    Logger.info('token: ' + token)
    Logger.info('req.cookies.token: ' + req.cookies.token)
    res.status(403).json({ error: 'false: token && req.body.author' })
  }
}
