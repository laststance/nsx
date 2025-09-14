import express from 'express'
import type { Router } from 'express'

import blueskyRoute from './routes/bluesky'
import postRoute from './routes/post'
import stockRoute from './routes/stock'
import translateRoute from './routes/translate'
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
router.use(translateRoute)
router.use(blueskyRoute)

// @TODO add update author info handler

export default router
