import bcrypt from 'bcrypt'
import express from 'express'
import type { CookieOptions, NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { isAuthorized } from './auth'
import db from './db/models'
import type AuthorModel from './db/models/authorModel'
import type PostModel from './db/models/postModel'
import type StockModel from './db/models/stockModel'
import Logger from './lib/Logger'

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 365,
  sameSite: 'none',
  secure: true, // 1 year cookie
}

const router = express.Router()

/**
 API Implementation
 */
router.get(
  '/user_count',
  async (req: Request, res: Response<GetUserCountResponse>) => {
    const userCount = await db.author.count()
    res.status(200).json({ userCount })
  }
)

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

    // @ts-ignore Argument of type '{ limit: number; order: string[][]; } | { limit: number; offset: number; order: string[][]; }' is not assignable to parameter of type 'FindOptions<any> | undefined'.
    const postList = await db.post.findAll(options)
    // @ts-ignore Type 'PostModel[]' is not assignable to type 'Post[]'. Type 'PostModel' is missing the following properties from type 'Post': createdAt, updatedAt
    res.status(200).json({ postList, total })
  }
)

router.get('/post/:id', async (req: Request, res: Response) => {
  const post = await db.post.findOne({
    where: { id: req.params.id },
  })

  res.status(200).json(post)
})

router.delete('/post/:id', async (req: Request, res: Response) => {
  if (!isAuthorized(req, res))
    return res.status(403).json({ message: 'unauthorized' })

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
        res.status(500).json({ error: `something wrong: ${JSON.stringify(error)}` }) /* eslint-disable-line prettier/prettier */
      }
    }
  }
)

router.post('/login', async ({ body }: Request, res: Response) => {
  const authorModelInstance = await db.author.findOne<AuthorModel>({
    where: { name: body.name },
  })
  if (authorModelInstance) {
    const author = authorModelInstance.toJSON() as Author
    const isValidPassword = await bcrypt.compare(body.password, author.password)

    if (isValidPassword) {
      const token: JWTtoken = jwt.sign(author, process.env.JWT_SECRET as string)
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
  if (!isAuthorized(req, res))
    return res.status(403).json({ message: 'unauthorized' })

  const { title, body } = req.body
  try {
    const postModelInstance = await db.post.create<PostModel>({
      body: body,
      title: title,
    })
    const post = postModelInstance.toJSON()
    res.status(201).json(post)
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(error)
      res.status(500).json({ error: error.message })
    } else {
      Logger.error(error)
      res.status(500).json({ error: `something wrong: ${JSON.stringify(error)}` }) /* eslint-disable-line prettier/prettier */
    }
  }
})

router.post(
  '/update',
  async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthorized(req, res))
      return res.status(403).json({ message: 'unauthorized' })

    const body = req.body
    try {
      await db.post.update(
        { body: body.body, title: body.title },
        { where: { id: body.id } }
      )

      res.status(200).json({ message: 'Post Updated!' })
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  }
)

// @TODO add recive chrome extension's request handler for page title and uril store in DB
router.post(
  '/push_stock',
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    try {
      const stockModelInstance = await db.stock.create<StockModel>({
        pageTitle: body.pageTitle,
        url: body.url,
      })
      const stock = stockModelInstance.toJSON()
      res.status(201).json(stock)
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  }
)

// @TODO add fetch stock handler

// @TODO add delete stock handler

// @TODO add update author info handler

export default router
