import type { Request, Response } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'

import { assertIsDefined } from '../lib/assertIsDefined'
import shallowEqualScalar from '../lib/shallowEqualScalar'

import { deleteJWTattribute, verifyAccessToken } from './lib/JWT'
import Logger from './lib/Logger'

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

      // トークンの期限切れを特別に処理
      if (error instanceof TokenExpiredError) {
        Logger.warn('Token expired')
        // クッキーをクリアしてログアウト処理
        res.cookie('token', '', { expires: new Date() })
        res.status(401).json({ error: 'Token expired. Please login again.' })
        return
      }

      // その他のJWTエラー
      Logger.error('decripted ' + JSON.stringify(decripted))
      Logger.error('token error: ')
      Logger.error(error)

      // 他のエラーの場合もクッキーをクリア
      res.cookie('token', '', { expires: new Date() })
      res.status(401).json({ error: 'Invalid token. Please login again.' })
      return
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
