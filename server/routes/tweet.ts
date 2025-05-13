import type { Request, Response, Router, NextFunction } from 'express'
import express from 'express'

import { isAuthorized } from '../auth'
import { prisma } from '../prisma'

const router: Router = express.Router()

router.get(
  '/',
  isAuthorized,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tweets = await prisma.tweet.findMany()
      res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },
)
