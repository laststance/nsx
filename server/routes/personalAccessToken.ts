import { randomBytes } from 'node:crypto'

import type { Request, Response, Router, RequestHandler } from 'express'
import express from 'express'
import rateLimit from 'express-rate-limit'

import { isAuthorized } from '../auth'
import { hashToken } from '../lib/authSession'
import Logger from '../lib/Logger'
import {
  mintPersonalAccessTokenBodySchema,
  type MintPersonalAccessTokenBody,
} from '../lib/requestSchemas'
import { validateBody } from '../lib/validateRequest'
import { prisma } from '../prisma'

const router: Router = express.Router()

const NO_TOKEN_MESSAGE = 'No token found'
const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error'
const TOKEN_NOT_FOUND_MESSAGE = 'Token not found'
const INVALID_TOKEN_ID_MESSAGE = 'Invalid token id'

const PAT_TOKEN_PREFIX = 'nsx_pat_'
const PAT_RANDOM_BYTES = 32
const PAT_SUFFIX_LENGTH = 4
const MINT_WINDOW_MS = 60 * 60 * 1000
const MINT_MAX_PER_WINDOW = 10
const isProd = process.env.NODE_ENV === 'production'

// Mirror the login limiter: enforce in production, pass through elsewhere so unit
// tests and local dev are not throttled. Caps token minting to 10 requests / hour.
const mintLimiter: RequestHandler = isProd
  ? rateLimit({
      windowMs: MINT_WINDOW_MS,
      max: MINT_MAX_PER_WINDOW,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: 'Too many token requests, please try again after an hour.',
      },
    })
  : (_req, _res, next) => next()

/**
 * Generates a fresh raw Personal Access Token string.
 *
 * Called once per mint request; only the hash of this value is persisted, so the
 * raw string returned here is the single copy the owner ever sees.
 *
 * @returns A `nsx_pat_<64 hex>` token carrying 256 bits of entropy.
 * @example generateRawPatToken() // => 'nsx_pat_3f9a…'
 */
const generateRawPatToken = (): string =>
  `${PAT_TOKEN_PREFIX}${randomBytes(PAT_RANDOM_BYTES).toString('hex')}`

/**
 * Mints a new PAT for the cookie-authenticated owner (E7).
 *
 * Mounted on `POST /api/personal_access_token`. The raw token is returned in the 201
 * body exactly once; only its SHA-256 hash and last-4 suffix are persisted, so it can
 * never be recovered from the database afterwards.
 *
 * @param req - Express request; `req.authenticatedUser` is set by `isAuthorized`.
 * @param res - Express response.
 * @returns
 * - 201 `{ id, name, tokenSuffix, createdAt, token }` on success
 * - 401 when the cookie session is missing; 500 on unexpected failure
 * @example router.post('/personal_access_token', …, mintPersonalAccessTokenHandler)
 */
export const mintPersonalAccessTokenHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.authenticatedUser?.id

    if (!userId) {
      res.status(401).json({ error: NO_TOKEN_MESSAGE })
      return
    }

    const body = req.body as MintPersonalAccessTokenBody
    const rawToken = generateRawPatToken()

    const created = await prisma.personalAccessToken.create({
      data: {
        tokenHash: hashToken(rawToken),
        tokenSuffix: rawToken.slice(-PAT_SUFFIX_LENGTH),
        name: body.name,
        userId,
      },
      select: { id: true, name: true, tokenSuffix: true, createdAt: true },
    })

    // `token` is disclosed only here; subsequent reads expose `tokenSuffix` only.
    res.status(201).json({ ...created, token: rawToken })
  } catch (error) {
    Logger.error(error)
    res.status(500).json({ error: INTERNAL_SERVER_ERROR_MESSAGE })
  }
}

/**
 * Lists the owner's PATs for the Settings UI (masked).
 *
 * Mounted on `GET /api/personal_access_token/list`. The select never includes
 * `tokenHash` or any raw value, so the masked `nsx_pat_…<suffix>` list cannot leak a
 * usable credential.
 *
 * @param req - Express request; `req.authenticatedUser` is set by `isAuthorized`.
 * @param res - Express response.
 * @returns
 * - 200 `{ tokens: [{ id, name, tokenSuffix, createdAt, lastUsedAt, revokedAt }] }`
 * - 401 when the cookie session is missing; 500 on unexpected failure
 * @example router.get('/personal_access_token/list', …, listPersonalAccessTokensHandler)
 */
export const listPersonalAccessTokensHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.authenticatedUser?.id

    if (!userId) {
      res.status(401).json({ error: NO_TOKEN_MESSAGE })
      return
    }

    const tokens = await prisma.personalAccessToken.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        tokenSuffix: true,
        createdAt: true,
        lastUsedAt: true,
        revokedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.status(200).json({ tokens })
  } catch (error) {
    Logger.error(error)
    res.status(500).json({ error: INTERNAL_SERVER_ERROR_MESSAGE })
  }
}

/**
 * Revokes one of the owner's PATs (E7), idempotently.
 *
 * Mounted on `DELETE /api/personal_access_token/:id`. Sets `revokedAt` so the PAT
 * stops authenticating. Scoped to the owner so one account cannot revoke another's
 * token, and idempotent — re-revoking returns the existing timestamp.
 *
 * @param req - Express request; `req.authenticatedUser` is set by `isAuthorized`.
 * @param res - Express response.
 * @returns
 * - 200 `{ id, revokedAt }` when revoked (or already revoked)
 * - 400 for a non-numeric id; 404 when the token is unknown / not owned
 * - 401 when the cookie session is missing; 500 on unexpected failure
 * @example router.delete('/personal_access_token/:id', …, revokePersonalAccessTokenHandler)
 */
export const revokePersonalAccessTokenHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.authenticatedUser?.id

    if (!userId) {
      res.status(401).json({ error: NO_TOKEN_MESSAGE })
      return
    }

    // Require a purely-numeric id. Number.parseInt('5abc', 10) === 5 would silently
    // treat a malformed id as token 5, contradicting the 400-for-non-numeric contract.
    const rawTokenId = String(req.params.id)
    if (!/^\d+$/.test(rawTokenId)) {
      res.status(400).json({ error: INVALID_TOKEN_ID_MESSAGE })
      return
    }
    const tokenId = Number.parseInt(rawTokenId, 10)

    // Ownership check is scoped by userId so one account can't revoke another's token.
    const existing = await prisma.personalAccessToken.findFirst({
      where: { id: tokenId, userId },
      select: { id: true, revokedAt: true },
    })

    if (!existing) {
      res.status(404).json({ error: TOKEN_NOT_FOUND_MESSAGE })
      return
    }

    // Already revoked → return the existing timestamp (idempotent revoke).
    if (existing.revokedAt) {
      res.status(200).json({ id: existing.id, revokedAt: existing.revokedAt })
      return
    }

    const revoked = await prisma.personalAccessToken.update({
      where: { id: tokenId },
      data: { revokedAt: new Date() },
      select: { id: true, revokedAt: true },
    })

    res.status(200).json(revoked)
  } catch (error) {
    Logger.error(error)
    res.status(500).json({ error: INTERNAL_SERVER_ERROR_MESSAGE })
  }
}

// Mint: cookie-authenticated, rate-limited, body-validated.
router.post(
  '/personal_access_token',
  mintLimiter,
  isAuthorized,
  validateBody(mintPersonalAccessTokenBodySchema),
  mintPersonalAccessTokenHandler,
)

// List: cookie-authenticated; never discloses the hash/raw value.
router.get(
  '/personal_access_token/list',
  isAuthorized,
  listPersonalAccessTokensHandler,
)

// Revoke: cookie-authenticated; owner-scoped + idempotent.
router.delete(
  '/personal_access_token/:id',
  isAuthorized,
  revokePersonalAccessTokenHandler,
)

export default router
