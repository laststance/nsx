import bcrypt from 'bcrypt'
import express from 'express'
import type { CookieOptions, NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { verifyCertainAdmin } from './auth'
import db from './db/models'
import type AuthorModel from './db/models/authorModel'
import type PostModel from './db/models/postModel'
import Logger from './lib/Logger'

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 24 * 365, // 1 year cookie
}

const router = express.Router()

/**
 API Implementation
 */
router.get(
  '/post_list',
  async (
    req: Request<_, _, _, PostListRequestParamServer>,
    res: Response<PostListResponce>
  ) => {
    const page = parseInt(req.query.page)
    const perPage = parseInt(req.query.perPage)
    const total = await db.post.count()

    const offset = perPage * (page - 1)
    let options
    if (0 >= offset) {
      options = {
        limit: perPage,
        order: [['id', 'DESC']],
      }
    } else {
      options = {
        limit: perPage,
        offset: offset,
        order: [['id', 'DESC']],
      }
    }

    // @ts-ignore
    const postList = await db.post.findAll(options)
    // @ts-ignore
    res.status(200).json({ total, postList })
  }
)

router.get('/post/:id', async (req: Request, res: Response) => {
  const post = await db.post.findOne({
    where: { id: req.params.id },
  })

  res.status(200).json(post)
})

router.delete('/post/:id', async (req: Request, res: Response) => {
  verifyCertainAdmin(req, res)
  try {
    await db.post.destroy({ where: { id: req.params.id } })
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
})

router.post(
  '/signup',
  async (req: Request<_, _, SignUpRequest>, res: Response<SignUpResponse>) => {
    const body = req.body
    if (!(body?.name && body?.password)) {
      Logger.warn('Empty Post Content. Might be data not formatted properly.')
      return res.status(400).json({
        error: 'Empty Post Content. Might be data not formatted properly.',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(body.password, salt)

    try {
      const modelInstance = await db.author.create<AuthorModel>({
        name: body.name,
        password: hash,
      })
      const author: JWTpayload = modelInstance.toJSON() as Author

      const token: JWTtoken = jwt.sign(author, process.env.JWT_SECRET as string)
      res.cookie('token', token, cookieOptions)
      res.status(201).json(author)
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(error)
        res.status(500).json({ error: error.message })
      } else {
        Logger.error(error)
        res
          .status(500)
          .json({ error: `something wrong: ${JSON.stringify(error)}` })
      }
    }
  }
)

router.post('/login', async (req: Request, res: Response) => {
  const body = req.body
  const authorModelInstance = await db.author.findOne<AuthorModel>({
    where: { name: body.name },
  })
  if (authorModelInstance) {
    const author = authorModelInstance.toJSON() as Author
    const isValidPassword = await bcrypt.compare(body.password, author.password)

    if (isValidPassword) {
      const token = jwt.sign(author, process.env.JWT_SECRET as string)
      res.cookie('token', token, cookieOptions)
      res.status(200).json(author)
    } else {
      Logger.warn('Invalid Password')
      res.status(200).json({ failed: 'Invalid Password' }) // this is bad practice in real world product. Because 'Invalid Password' imply exists user that you input at the moment.
    }
  } else {
    Logger.warn('User does not exist')
    res.status(200).json({ failed: 'User does not exist' }) // this also bad practice in real world product Same reason.
  }
})

router.get('/logout', (req: Request, res: Response<LogoutResponse>) => {
  res.cookie('token', '', { expires: new Date() })
  res.status(200).json({ message: 'Logout Successful' })
})

router.post('/create', async (req: Request, res: Response) => {
  verifyCertainAdmin(req, res)
  const { title, body } = req.body
  try {
    const postModelInstance = await db.post.create<PostModel>({
      title: title,
      body: body,
    })
    const post = postModelInstance.toJSON()
    res.status(201).json(post)
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(error)
      res.status(500).json({ error: error.message })
    } else {
      Logger.error(error)
      res
        .status(500)
        .json({ error: `something wrong: ${JSON.stringify(error)}` })
    }
  }
})

router.post(
  '/update',
  async (req: Request, res: Response, next: NextFunction) => {
    verifyCertainAdmin(req, res)
    const body = req.body
    try {
      await db.post.update(
        { title: body.title, body: body.body },
        { where: { id: body.id } }
      )

      res.status(200).json({ message: 'Post Updated!' })
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  }
)

export default router
