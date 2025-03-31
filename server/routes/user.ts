import bcrypt from 'bcrypt'
import type { Request, Response, Router, RequestHandler } from 'express'
import express from 'express'

import { generateAccessToken, cookieOptions } from '../lib/JWT'
import Logger from '../lib/Logger'
import { prisma } from '../prisma'

const router: Router = express.Router()

interface SignupRequest {
  name: string
  password: string
}

router.get(
  '/user_count',
  async (_req: Request, res: Response<Res.GetUserCount>) => {
    const userCount = await prisma.authors.count()
    res.status(200).json({ userCount })
  },
)

const signupHandler: RequestHandler = async (req, res) => {
  const body = req.body as SignupRequest
  if (!(body?.name && body?.password)) {
    Logger.warn('Empty Post Content. Might be data not formatted properly.')
    res.status(400).json({
      error: 'Empty Post Content. Might be data not formatted properly.',
    })
    return
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(body.password, salt)

  try {
    const author = await prisma.authors.create({
      data: {
        name: body.name,
        password: hash,
      },
    })

    const token: JWTtoken = generateAccessToken(author)
    res.cookie('token', token, cookieOptions)
    res.status(201).json(author)
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
}

router.post('/signup', signupHandler)

router.post('/login', async ({ body }: Request, res: Response) => {
  const author = await prisma.authors.findFirst({
    where: { name: body.name },
  })
  if (author) {
    const isValidPassword = await bcrypt.compare(body.password, author.password)

    if (isValidPassword) {
      const token: JWTtoken = generateAccessToken(author)
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

router.get('/logout', (_req: Request, res: Response<Res.Logout>) => {
  res.cookie('token', '', { expires: new Date() })
  res.status(200).json({ message: 'Logout Successful' })
})

export default router
