import type { Request, Response, Router, NextFunction } from 'express'
import express from 'express'

import { isAuthorized } from '../auth'
import Logger from '../lib/Logger'
import { prisma } from '../prisma'

const router: Router = express.Router()

router.get('/post/:id', async (req: Request, res: Response) => {
  const post = await prisma.posts.findFirst({
    where: { id: parseInt(req.params.id, 10) },
  })

  res.status(200).json(post)
})

router.delete(
  '/post/:id',
  isAuthorized,
  async (req: Request, res: Response) => {
    try {
      await prisma.posts.delete({ where: { id: parseInt(req.params.id, 10) } })
      res.status(200).json({ message: 'Delete Successful!' })
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
    const page = parseInt(req.query.page, 10)
    const perPage = parseInt(req.query.perPage, 10)
    const total = await prisma.posts.count()

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

    const postList = await prisma.posts.findMany(options as any)
    res.status(200).json({ postList, total })
  },
)

router.post('/create', isAuthorized, async (req: Request, res: Response) => {
  const { title, body } = req.body
  try {
    const post = await prisma.posts.create({
      data: {
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
})

router.post(
  '/update',
  isAuthorized,
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    try {
      await prisma.posts.update({
        data: { title: body.title, body: body.body },
        where: { id: parseInt(body.id, 10) },
      })

      res.status(200).json({ message: 'Successfully Updated!' })
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  },
)

export default router
