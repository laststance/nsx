import type { Request, Response, Router, NextFunction } from 'express'
import express from 'express'

import { prisma } from '../prisma'

const tweet: Router = express.Router()

// TODO: add Tweet[] type to Response generic
tweet.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tweets = await prisma.tweet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.status(200).json(tweets)
  } catch (error) {
    next(error)
  }
})

tweet.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body
    const tweet = await prisma.tweet.create({ data: { text } })

    res.status(201).json(tweet)
  } catch (error) {
    next(error)
  }
})

tweet.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const tweetId = parseInt(id, 10)

      if (isNaN(tweetId)) {
        return res.status(400).json({ error: 'Invalid tweet ID' })
      }

      await prisma.tweet.delete({
        where: { id: tweetId },
      })

      res.status(200).json({ message: 'Tweet deleted successfully' })
    } catch (error) {
      next(error)
    }
  },
)

export default tweet
