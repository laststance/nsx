import express from 'express'
import type { Router } from 'express'

import postRoute from './routes/post'
import stockRoute from './routes/stock'
import userRoute from './routes/user'

const router: Router = express.Router()

router.use(postRoute)
router.use(userRoute)
router.use(stockRoute)

// @TODO add update author info handler

export default router
