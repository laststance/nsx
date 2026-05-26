import type { Request, Response, Router, NextFunction } from 'express'
import express from 'express'

import { isAuthorized } from '../auth'
import Logger from '../lib/Logger'
import {
  createPostBodySchema,
  type CreatePostBody,
  type UpdatePostBody,
  updatePostBodySchema,
} from '../lib/requestSchemas'
import { validateBody } from '../lib/validateRequest'
import { prisma } from '../prisma'

const router: Router = express.Router()

/**
 * Checks whether the authenticated user owns a post before mutation.
 *
 * Called by update/delete handlers so logged-in users cannot alter another
 * author's content.
 *
 * @param postId - Post ID from the route or request body.
 * @param authorId - Authenticated user ID from the session cookie.
 * @returns Ownership status for response mapping.
 * @example await getPostOwnershipStatus(1, 1)
 */
const getPostOwnershipStatus = async (
  postId: number,
  authorId: number,
): Promise<'allowed' | 'forbidden' | 'missing'> => {
  const post = await prisma.post.findUnique({
    select: { authorId: true },
    where: { id: postId },
  })

  if (!post) return 'missing'
  if (post.authorId !== authorId) return 'forbidden'

  return 'allowed'
}

router.get('/post/:id', async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findFirst({
      where: { id: parseInt(String(req.params.id), 10) },
    })

    res.status(200).json(post)
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(error)
      res.status(500).json({ error: error.message })
    } else {
      Logger.error(error)
      res.status(500).json({
        error: `something wrong: ${JSON.stringify(error)}`,
      })
    }
  }
})

router.delete(
  '/post/:id',
  isAuthorized,
  async (req: Request, res: Response) => {
    try {
      const postId = parseInt(String(req.params.id), 10)
      const authorId = req.authenticatedUser?.id

      if (!authorId) {
        res.status(401).json({ error: 'No token found' })
        return
      }

      const ownership = await getPostOwnershipStatus(postId, authorId)

      // Missing and forbidden are separated so clients can show the right state.
      if (ownership === 'missing') {
        res.status(404).json({ error: 'Post not found' })
        return
      }

      if (ownership === 'forbidden') {
        res.status(403).json({ error: 'Forbidden' })
        return
      }

      await prisma.post.delete({
        where: { id: postId },
      })
      res.status(204).send()
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(error)
        res.status(500).json({ message: error.message })
      } else {
        Logger.error(error)
        res
          .status(500)
          .json({ message: `someting wrong: ${JSON.stringify(error)}` })
      }
    }
  },
)

router.get(
  '/post_list',
  async (
    req: Request<
      _,
      _,
      _,
      {
        page: Override<Req.PostList['page'], string>
        perPage: Override<Req.PostList['perPage'], string>
      }
    >,
    res: Response,
  ) => {
    try {
      const page = parseInt(req.query.page, 10)
      const perPage = parseInt(req.query.perPage, 10)
      const total = await prisma.post.count()

      const offset = perPage * (page - 1)
      const options =
        0 >= offset
          ? {
              take: perPage,
              orderBy: { id: 'desc' as const },
            }
          : ({
              take: perPage,
              skip: offset,
              orderBy: { id: 'desc' as const },
            } as const)

      const postList = await prisma.post.findMany(options as any)
      res.status(200).json({ postList, total })
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(error)
        res.status(500).json({ error: error.message })
      } else {
        Logger.error(error)
        res.status(500).json({
          error: `something wrong: ${JSON.stringify(error)}`,
        })
      }
    }
  },
)

router.post(
  '/create',
  isAuthorized,
  validateBody(createPostBodySchema),
  async (req: Request, res: Response) => {
    const { title, body } = req.body as CreatePostBody
    try {
      const authorId = req.authenticatedUser?.id

      if (!authorId) {
        res.status(401).json({ error: 'No token found' })
        return
      }

      const post = await prisma.post.create({
        data: {
          authorId,
          title: title,
          body: body,
        },
      })
      res.status(201).json(post)
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(error)
        res.status(500).json({ error: error.message })
      } else {
        Logger.error(error)
        res.status(500).json({
          error: `something wrong: ${JSON.stringify(error)}`,
        })
      }
    }
  },
)

router.post(
  '/update',
  isAuthorized,
  validateBody(updatePostBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as UpdatePostBody
    try {
      const authorId = req.authenticatedUser?.id

      if (!authorId) {
        res.status(401).json({ error: 'No token found' })
        return
      }

      const ownership = await getPostOwnershipStatus(body.id, authorId)

      // Only the post owner can update title/body.
      if (ownership === 'missing') {
        res.status(404).json({ error: 'Post not found' })
        return
      }

      if (ownership === 'forbidden') {
        res.status(403).json({ error: 'Forbidden' })
        return
      }

      await prisma.post.update({
        data: { title: body.title, body: body.body },
        where: { id: body.id },
      })

      res.status(200).json({ message: 'Successfully Updated!' })
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  },
)

export default router
