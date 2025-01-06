import express from 'express'
import type { Router, CookieOptions } from 'express'

import postRoute from './routes/post'
import stockRoute from './routes/stock'
import userRoute from './routes/user'

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 365,
  sameSite: 'none',
  secure: true, // 1 year cookie
}

const router: Router = express.Router()

router.use(postRoute)
router.use(userRoute)
router.use(stockRoute)

// @TODO add update author info handler

export default router
