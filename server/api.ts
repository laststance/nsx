import express from 'express'
import type { Router } from 'express'

import postRoute from './routes/post'
import stockRoute from './routes/stock'
import tweet from './routes/tweet'
import userRoute from './routes/user'

const router: Router = express.Router()

// TODO: Refactor /tweet style
router.use(postRoute)
// TODO: Refactor /tweet style
router.use(userRoute)
// TODO: Refactor /tweet style
router.use(stockRoute)
router.use('/tweet', tweet)

// @TODO add update author info handler

export default router
