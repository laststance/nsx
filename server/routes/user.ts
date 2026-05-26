import bcrypt from 'bcrypt'
import type { Request, Response, Router, RequestHandler } from 'express'
import express from 'express'
import rateLimit from 'express-rate-limit'

import {
  generateAccessToken,
  getCookieOptions,
  verifyAccessToken,
} from '../lib/JWT'
import Logger from '../lib/Logger'
import { prisma } from '../prisma'

const router: Router = express.Router()

const AUTHENTICATION_FAILED_CODE = 'AUTHENTICATION_FAILED'
const AUTHENTICATION_FAILED_MESSAGE = 'Invalid credentials'
const AUTHENTICATION_SERVICE_ERROR_CODE = 'AUTHENTICATION_SERVICE_ERROR'
const AUTHENTICATION_SERVICE_ERROR_MESSAGE =
  'Authentication service temporarily unavailable'
const DUMMY_PASSWORD_HASH =
  '$2b$10$PDIcmRmxvgVeIaa/c9AWiu4wRQD7EwBjczFqVDjgMtsj4.To0W5aC'
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 5
const isProd = process.env.NODE_ENV === 'production'
const loginLimiter: RequestHandler = isProd
  ? rateLimit({
      windowMs: LOGIN_WINDOW_MS,
      max: LOGIN_MAX_ATTEMPTS,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: 'Too many login attempts, please try again after 15 minutes.',
      },
    })
  : (_req, _res, next) => next()

interface SignupRequest {
  name: string
  password: string
}

/**
 * Converts a submitted login name into the database lookup value.
 *
 * Called only by the login endpoint before querying Prisma, so malformed
 * bodies are handled like any other failed credential attempt.
 *
 * @param name - Raw `req.body.name` value from the login form.
 * @returns Trimmed user name, or an empty string when the value is invalid.
 * @example normalizeLoginName(' John Doe ') // 'John Doe'
 */
const normalizeLoginName = (name: unknown): string => {
  if (typeof name !== 'string') return ''
  return name.trim()
}

/**
 * Converts a submitted login password into the bcrypt comparison value.
 *
 * Called only by the login endpoint, and intentionally keeps whitespace
 * because passwords can legally contain leading or trailing spaces.
 *
 * @param password - Raw `req.body.password` value from the login form.
 * @returns Password string, or an empty string when the value is invalid.
 * @example normalizeLoginPassword(' secret ') // ' secret '
 */
const normalizeLoginPassword = (password: unknown): string => {
  if (typeof password !== 'string') return ''
  return password
}

/**
 * Sends the public login failure response shared by every credential failure.
 *
 * Called by `/api/login` whenever the username is unknown, the password is
 * wrong, or the submitted body is malformed.
 *
 * @param res - Express response used to return the failed login payload.
 * @returns Nothing; the response is completed with status 401.
 * @example sendAuthenticationFailure(res)
 */
const sendAuthenticationFailure = (
  res: Response<Res.Login | Res.AuthError | Res.Error>,
): void => {
  res.status(401).json({
    error: AUTHENTICATION_FAILED_MESSAGE,
    code: AUTHENTICATION_FAILED_CODE,
  })
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

router.post(
  '/login',
  loginLimiter,
  async (
    { body }: Request,
    res: Response<Res.Login | Res.AuthError | Res.Error>,
  ) => {
    const name = normalizeLoginName(body?.name)
    const password = normalizeLoginPassword(body?.password)

    try {
      // Malformed login bodies use the same public response as bad credentials.
      if (!(name && password)) {
        await bcrypt.compare(
          password || 'missing-password',
          DUMMY_PASSWORD_HASH,
        )
        Logger.warn('Failed login attempt')
        sendAuthenticationFailure(res)
        return
      }

      const user = await prisma.user.findFirst({
        where: { name },
      })
      const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH
      const isValidPassword = await bcrypt.compare(password, passwordHash)

      // Unknown users and wrong passwords must be indistinguishable to callers.
      if (!(user && isValidPassword)) {
        Logger.warn('Failed login attempt')
        sendAuthenticationFailure(res)
        return
      }

      const token: JWTtoken = generateAccessToken(user)
      res.cookie('token', token, getCookieOptions(token))
      // Return user without password.
      res.status(200).json({
        id: user.id,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    } catch (error) {
      Logger.error(error)
      res.status(500).json({
        error: AUTHENTICATION_SERVICE_ERROR_MESSAGE,
        code: AUTHENTICATION_SERVICE_ERROR_CODE,
      })
    }
  },
)

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
