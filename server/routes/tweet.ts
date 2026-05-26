import type { Request, Response, Router, NextFunction } from 'express'
import express from 'express'

import { isAuthorized } from '../auth'
import Logger from '../lib/Logger'
import {
  createTweetBodySchema,
  type CreateTweetBody,
} from '../lib/requestSchemas'
import { validateBody } from '../lib/validateRequest'
import { prisma } from '../prisma'

const tweet: Router = express.Router()

/**
 * Checks whether the authenticated user owns a tweet before deletion.
 *
 * Called by the tweet delete endpoint so one logged-in user cannot delete
 * another user's tweet.
 *
 * @param tweetId - Tweet ID from the route parameter.
 * @param userId - Authenticated user ID from the session cookie.
 * @returns Ownership status for response mapping.
 * @example await getTweetOwnershipStatus(1, 1)
 */
const getTweetOwnershipStatus = async (
  tweetId: number,
  userId: number,
): Promise<'allowed' | 'forbidden' | 'missing'> => {
  const existingTweet = await prisma.tweet.findUnique({
    select: { userId: true },
    where: { id: tweetId },
  })

  if (!existingTweet) return 'missing'
  if (existingTweet.userId !== userId) return 'forbidden'

  return 'allowed'
}

// TODO: add Tweet[] type to Response generic
tweet.get(
  '/',
  isAuthorized,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.authenticatedUser?.id

      if (!userId) {
        res.status(401).json({ error: 'No token found' })
        return
      }

      const tweets = await prisma.tweet.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.status(200).json(tweets)
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  },
)

// Paginated tweet list endpoint
tweet.get(
  '/tweet_list',
  isAuthorized,
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
      const userId = req.authenticatedUser?.id

      if (!userId) {
        res.status(401).json({ error: 'No token found' })
        return
      }

      const page = parseInt(req.query.page, 10)
      const perPage = parseInt(req.query.perPage, 10)
      const total = await prisma.tweet.count({ where: { userId } })

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

      const tweetList = await prisma.tweet.findMany({
        ...(options as any),
        where: { userId },
      })
      res.status(200).json({ tweetList, total })
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  },
)

tweet.post(
  '/',
  isAuthorized,
  validateBody(createTweetBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.authenticatedUser?.id

      if (!userId) {
        res.status(401).json({ error: 'No token found' })
        return
      }

      const { text } = req.body as CreateTweetBody
      const tweet = await prisma.tweet.create({ data: { text, userId } })

      res.status(201).json(tweet)
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  },
)

tweet.delete(
  '/:id',
  isAuthorized,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(String(req.params.id), 10)
      const userId = req.authenticatedUser?.id

      if (!userId) {
        res.status(401).json({ error: 'No token found' })
        return
      }

      const ownership = await getTweetOwnershipStatus(id, userId)

      // Only the tweet owner can remove a tweet.
      if (ownership === 'missing') {
        res.status(404).json({ error: 'Tweet not found' })
        return
      }

      if (ownership === 'forbidden') {
        res.status(403).json({ error: 'Forbidden' })
        return
      }

      await prisma.tweet.delete({ where: { id } })

      res.status(204).send()
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  },
)

export default tweet
