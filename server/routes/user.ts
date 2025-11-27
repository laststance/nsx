import bcrypt from 'bcrypt'
import type { Request, Response, Router, RequestHandler } from 'express'
import express from 'express'

import {
  generateAccessToken,
  getCookieOptions,
  verifyAccessToken,
} from '../lib/JWT'
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
    const userCount = await prisma.user.count()
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
    const user = await prisma.user.create({
      data: {
        name: body.name,
        password: hash,
      },
    })

    const token: JWTtoken = generateAccessToken(user)
    res.cookie('token', token, getCookieOptions(token))
    // Return user without password
    res.status(201).json({
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
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
  const user = await prisma.user.findFirst({
    where: { name: body.name },
  })
  if (user) {
    const isValidPassword = await bcrypt.compare(body.password, user.password)

    if (isValidPassword) {
      const token: JWTtoken = generateAccessToken(user)
      res.cookie('token', token, getCookieOptions(token))
      // Return user without password
      res.status(200).json({
        id: user.id,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
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

const validateHandler: RequestHandler = async (req: Request, res: Response) => {
  const token = req.cookies.token as JWTtoken

  if (!token) {
    res.status(401).json({ valid: false, message: 'No token found' })
    return
  }

  try {
    const decoded = verifyAccessToken(token)
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id: decoded.id },
    })

    if (user) {
      res.status(200).json({ valid: true, user })
    } else {
      res.cookie('token', '', { expires: new Date() })
      res.status(401).json({ valid: false, message: 'User not found' })
    }
  } catch {
    // Clear invalid token
    res.cookie('token', '', { expires: new Date() })
    res.status(401).json({ valid: false, message: 'Invalid or expired token' })
  }
}

router.get('/validate', validateHandler)

router.get('/hover-color-preference', async (req: Request, res: Response) => {
  const token = req.cookies.token as JWTtoken

  if (!token) {
    res.status(401).json({ error: 'No token found' })
    return
  }

  try {
    const decoded = verifyAccessToken(token)
    const user = await prisma.user.findFirst({
      select: {
        useLegacyHoverColors: true,
      },
      where: { id: decoded.id },
    })

    if (user) {
      res.status(200).json({ useLegacyHoverColors: user.useLegacyHoverColors })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    Logger.error(error)
    res.status(401).json({ error: 'Invalid or expired token' })
  }
})

router.patch('/hover-color-preference', async (req: Request, res: Response) => {
  const token = req.cookies.token as JWTtoken

  if (!token) {
    res.status(401).json({ error: 'No token found' })
    return
  }

  try {
    const decoded = verifyAccessToken(token)
    const { useLegacyHoverColors } = req.body

    if (typeof useLegacyHoverColors !== 'boolean') {
      res.status(400).json({ error: 'useLegacyHoverColors must be a boolean' })
      return
    }

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { useLegacyHoverColors },
      select: {
        useLegacyHoverColors: true,
      },
    })

    res.status(200).json({ useLegacyHoverColors: user.useLegacyHoverColors })
  } catch (error) {
    Logger.error(error)
    res.status(500).json({ error: 'Failed to update hover color preference' })
  }
})

router.patch('/profile', async (req: Request, res: Response) => {
  const token = req.cookies.token as JWTtoken

  if (!token) {
    res.status(401).json({ error: 'No token found' })
    return
  }

  try {
    const decoded = verifyAccessToken(token)
    const { name, password } = req.body

    // Validate that at least one field is being updated
    if (!name && !password) {
      res.status(400).json({
        error: 'At least one field (name or password) must be provided',
      })
      return
    }

    // Prepare update data
    const updateData: { name?: string; password?: string } = {}

    if (name) {
      updateData.name = name
    }

    if (password) {
      // Hash the new password
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(password, salt)
    }

    // Update user in database
    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.status(200).json(user)
  } catch (error) {
    Logger.error(error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
