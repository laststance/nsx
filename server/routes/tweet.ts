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

// Paginated tweet list endpoint
tweet.get(
  '/tweet_list',
  async (
    req: Request<
      _,
      _,
      _,
      {
        page: string
        perPage: string
      }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page, 10)
      const perPage = parseInt(req.query.perPage, 10)
      const total = await prisma.tweet.count()

      const offset = perPage * (page - 1)
      const options =
        0 >= offset
          ? {
              take: perPage,
              orderBy: { createdAt: 'desc' as const },
            }
          : ({
              take: perPage,
              skip: offset,
              orderBy: { createdAt: 'desc' as const },
            } as const)

      const tweetList = await prisma.tweet.findMany(options as any)
      res.status(200).json({ tweetList, total })
    } catch (error) {
      next(error)
    }
  },
)

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
      const id = parseInt(req.params.id, 10)
      await prisma.tweet.delete({ where: { id } })

      res.status(200).json({ message: 'Tweet deleted successfully' })
    } catch (error) {
      next(error)
    }
  },
)

export default tweet
