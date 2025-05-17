import type { Request, Response, Router, NextFunction } from 'express'
import express from 'express'

import { isAuthorized } from '../auth'
import { prisma } from '../prisma'

export const tweet: Router = express.Router()

tweet.get(
  '/',
  isAuthorized,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tweets = await prisma.tweet.findMany()
      res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },
)
