import bcrypt from 'bcrypt'
import type { Request, Response, Router, RequestHandler } from 'express'
import express from 'express'
import rateLimit from 'express-rate-limit'

import { Prisma } from '../../generated/prisma/client'
import {
  authenticateRequestSession,
  clearAuthCookies,
  issueAuthCookies,
  revokeRefreshToken,
} from '../lib/authSession'
import Logger from '../lib/Logger'
import {
  hoverColorPreferenceBodySchema,
  type HoverColorPreferenceBody,
  loginBodySchema,
  signupBodySchema,
  type SignupBody,
  updateProfileBodySchema,
  type UpdateProfileBody,
} from '../lib/requestSchemas'
import { formatValidationIssues, validateBody } from '../lib/validateRequest'
import { prisma } from '../prisma'

const router: Router = express.Router()

const AUTHENTICATION_FAILED_CODE = 'AUTHENTICATION_FAILED'
const AUTHENTICATION_FAILED_MESSAGE = 'Invalid credentials'
const AUTHENTICATION_SERVICE_ERROR_CODE = 'AUTHENTICATION_SERVICE_ERROR'
const AUTHENTICATION_SERVICE_ERROR_MESSAGE =
  'Authentication service temporarily unavailable'
const USERNAME_ALREADY_EXISTS_CODE = 'USERNAME_ALREADY_EXISTS'
const USERNAME_ALREADY_EXISTS_MESSAGE = 'Username already exists'
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
 * Called by `/api/login` whenever the username is unknown or the password is
 * wrong.
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

/**
 * Detects database unique-constraint failures from Prisma writes.
 *
 * Called after signup create races so the API keeps the same conflict response
 * as the pre-create username check.
 *
 * @param error - Unknown value caught from Prisma.
 * @returns True when Prisma reports a duplicate-key write.
 * @example isUniqueConstraintError(error)
 */
const isUniqueConstraintError = (error: unknown): boolean => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  )
}

router.get(
  '/user_count',
  async (_req: Request, res: Response<Res.GetUserCount>) => {
    const userCount = await prisma.user.count()
    res.status(200).json({ userCount })
  },
)

const signupHandler: RequestHandler = async (req, res) => {
  const body = req.body as SignupBody

  try {
    const existingUser = await prisma.user.findUnique({
      select: { id: true },
      where: { name: body.name },
    })

    // Usernames are unique at the database layer, so conflict before hashing.
    if (existingUser) {
      res.status(409).json({
        error: USERNAME_ALREADY_EXISTS_MESSAGE,
        code: USERNAME_ALREADY_EXISTS_CODE,
      })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(body.password, salt)

    const user = await prisma.user.create({
      data: {
        name: body.name,
        password: hash,
      },
    })

    await issueAuthCookies(res, user)
    // Return user without password
    res.status(201).json({
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      res.status(409).json({
        error: USERNAME_ALREADY_EXISTS_MESSAGE,
        code: USERNAME_ALREADY_EXISTS_CODE,
      })
      return
    }

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

router.post('/signup', validateBody(signupBodySchema), signupHandler)

router.post(
  '/login',
  loginLimiter,
  async (
    { body }: Request,
    res: Response<Res.Login | Res.AuthError | Res.Error>,
  ) => {
    const parsedBody = loginBodySchema.safeParse(body)
    const name = parsedBody.success
      ? parsedBody.data.name
      : normalizeLoginName(body?.name)
    const password = parsedBody.success
      ? parsedBody.data.password
      : normalizeLoginPassword(body?.password)

    try {
      // Malformed bodies still run bcrypt but return the validation status.
      if (!parsedBody.success) {
        await bcrypt.compare(
          password || 'missing-password',
          DUMMY_PASSWORD_HASH,
        )
        Logger.info('Invalid login payload')
        res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: formatValidationIssues(parsedBody.error.issues),
        })
        return
      }

      const user = await prisma.user.findUnique({
        where: { name },
      })
      const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH
      const isValidPassword = await bcrypt.compare(password, passwordHash)

      // Unknown users and wrong passwords must be indistinguishable to callers.
      if (!(user && isValidPassword)) {
        Logger.info('Failed login attempt')
        sendAuthenticationFailure(res)
        return
      }

      await issueAuthCookies(res, user)
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

router.post('/logout', async (req: Request, res: Response<Res.Logout>) => {
  try {
    await revokeRefreshToken(req.cookies.refreshToken as JWTtoken | undefined)
  } catch (error) {
    Logger.error(error)
  } finally {
    clearAuthCookies(res)
  }

  res.status(200).json({ success: true })
})

const validateHandler: RequestHandler = async (req: Request, res: Response) => {
  const session = await authenticateRequestSession(req, res)

  if (!session.ok) {
    res.status(session.status).json({ valid: false, message: session.message })
    return
  }

  const {
    password: _password,
    useLegacyHoverColors: _useLegacy,
    sessionVersion: _sessionVersion,
    ...user
  } = session.user
  res.status(200).json({ valid: true, user })
}

router.get('/validate', validateHandler)

router.get('/hover-color-preference', async (req: Request, res: Response) => {
  const session = await authenticateRequestSession(req, res)

  if (!session.ok) {
    res.status(session.status).json({ error: session.message })
    return
  }

  try {
    const user = await prisma.user.findFirst({
      select: {
        useLegacyHoverColors: true,
      },
      where: { id: session.user.id },
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

router.patch(
  '/hover-color-preference',
  validateBody(hoverColorPreferenceBodySchema),
  async (req: Request, res: Response) => {
    const session = await authenticateRequestSession(req, res)

    if (!session.ok) {
      res.status(session.status).json({ error: session.message })
      return
    }

    try {
      const { useLegacyHoverColors } = req.body as HoverColorPreferenceBody

      const user = await prisma.user.update({
        where: { id: session.user.id },
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
  },
)

router.patch(
  '/profile',
  validateBody(updateProfileBodySchema),
  async (req: Request, res: Response) => {
    const session = await authenticateRequestSession(req, res)

    if (!session.ok) {
      res.status(session.status).json({ error: session.message })
      return
    }

    try {
      const { name, password } = req.body as UpdateProfileBody

      // Prepare update data
      const updateData: {
        name?: string
        password?: string
        sessionVersion?: { increment: number }
      } = {}

      if (name) {
        updateData.name = name
      }

      if (password) {
        // Hash the new password
        const salt = await bcrypt.genSalt(10)
        updateData.password = await bcrypt.hash(password, salt)
        updateData.sessionVersion = { increment: 1 }
      }

      // Update user in database
      const user = await prisma.user.update({
        where: { id: session.user.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          password: true,
          sessionVersion: true,
          createdAt: true,
          updatedAt: true,
          useLegacyHoverColors: true,
        },
      })

      if (password || user.name !== session.user.name) {
        await issueAuthCookies(res, user)
      }

      const {
        password: _password,
        useLegacyHoverColors: _useLegacy,
        sessionVersion: _sessionVersion,
        ...responseUser
      } = user
      res.status(200).json(responseUser)
    } catch (error) {
      Logger.error(error)
      res.status(500).json({ error: 'Failed to update profile' })
    }
  },
)

export default router
