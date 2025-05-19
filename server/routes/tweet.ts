import type { Request, Response, Router, NextFunction } from 'express'
import express from 'express'

import { prisma } from '../prisma'

const tweet: Router = express.Router()

// TODO: add Tweet[] type to Response generic
tweet.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tweets = await prisma.tweet.findMany()

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

export default tweet
