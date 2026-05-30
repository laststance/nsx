import { createHash } from 'node:crypto'

import type { Request, Response } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import { prisma } from '../prisma'

import {
  ACCESS_TOKEN_COOKIE_NAME,
  type AuthTokenPayload,
  REFRESH_TOKEN_COOKIE_NAME,
  generateAccessToken,
  generateRefreshToken,
  getCookieOptions,
  getRefreshCookieOptions,
  getTokenExpiration,
  verifyAccessToken,
  verifyRefreshToken,
} from './JWT'
import Logger from './Logger'

export type AuthenticatedSessionUser = AuthenticatedUser

type AuthSessionResult =
  | { ok: true; user: AuthenticatedSessionUser }
  | { ok: false; status: 401 | 500; message: string }

const SESSION_USER_SELECT = {
  id: true,
  name: true,
  password: true,
  sessionVersion: true,
  createdAt: true,
  updatedAt: true,
  useLegacyHoverColors: true,
} as const

/**
 * Hashes a bearer credential (refresh token or PAT) before it is stored or looked up.
 *
 * Shared by refresh-token persistence and personal-access-token mint/verify so raw
 * credentials never live in the database; both store and compare on the digest only.
 *
 * @param token - Raw bearer credential (refresh-token cookie value or `nsx_pat_<raw>`).
 * @returns SHA-256 hex digest of the token.
 * @example hashToken(refreshToken)
 */
export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Checks whether an error came from JWT verification.
 *
 * Called before deciding whether a failed auth attempt can try refresh-token
 * rotation or must be treated as a server error.
 *
 * @param error - Unknown error thrown by `jsonwebtoken`.
 * @returns True for expired or malformed JWT errors.
 * @example isJwtVerificationError(error)
 */
const isJwtVerificationError = (error: unknown): boolean => {
  return (
    error instanceof TokenExpiredError || error instanceof JsonWebTokenError
  )
}

/**
 * Extracts the user identity fields from a JWT payload.
 *
 * Called before querying Prisma, so malformed payloads are rejected as
 * unauthenticated requests.
 *
 * @param payload - Verified JWT payload.
 * @returns Minimal identity tuple, or null when the payload is invalid.
 * @example getTokenIdentity(payload)
 */
const getTokenIdentity = (
  payload: AuthTokenPayload,
): { id: number; sessionVersion: number } | null => {
  const id = Number(payload.sub)
  if (!Number.isInteger(id)) return null

  return { id, sessionVersion: payload.sessionVersion }
}

/**
 * Finds the current user represented by a verified token payload.
 *
 * Called by access and refresh flows to reject stale sessions after password
 * changes or account removal.
 *
 * @param payload - Verified access or refresh JWT payload.
 * @returns Current user if the token still maps to a valid account.
 * @example await findUserForTokenPayload(decoded)
 */
const findUserForTokenPayload = async (
  payload: AuthTokenPayload,
): Promise<AuthenticatedSessionUser | null> => {
  const identity = getTokenIdentity(payload)
  if (!identity) return null

  return prisma.user.findFirst({
    select: SESSION_USER_SELECT,
    where: {
      id: identity.id,
      sessionVersion: identity.sessionVersion,
    },
  })
}

/**
 * Expires both authentication cookies.
 *
 * Called by logout and every invalid-token response so clients stop replaying
 * rejected credentials.
 *
 * @param res - Express response used to update cookies.
 * @returns Nothing; cookies are expired on the response.
 * @example clearAuthCookies(res)
 */
export const clearAuthCookies = (res: Response): void => {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, '', { expires: new Date() })
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', { expires: new Date() })
}

/**
 * Persists a freshly generated refresh token.
 *
 * Called by login/signup and refresh rotation before cookies are returned.
 *
 * @param userId - User that owns the refresh token.
 * @param refreshToken - Raw refresh token to hash and store.
 * @returns Nothing after the token row is created.
 * @example await storeRefreshToken(1, refreshToken)
 */
const storeRefreshToken = async (
  userId: number,
  refreshToken: JWTtoken,
): Promise<void> => {
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId,
      expiresAt: getTokenExpiration(refreshToken),
    },
  })
}

/**
 * Revokes a refresh token if it exists.
 *
 * Called by logout and rotation to make replay of an old refresh cookie fail.
 *
 * @param refreshToken - Raw refresh token cookie value.
 * @returns Nothing after matching active token rows are revoked.
 * @example await revokeRefreshToken(refreshToken)
 */
export const revokeRefreshToken = async (
  refreshToken: JWTtoken | undefined,
): Promise<void> => {
  if (!refreshToken) return

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashToken(refreshToken),
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  })
}

/**
 * Issues a new access/refresh cookie pair.
 *
 * Called by login/signup and after profile password changes so the browser has
 * current short-lived access credentials plus a persisted refresh credential.
 *
 * @param res - Express response used to set cookies.
 * @param user - Authenticated user used to sign both tokens.
 * @returns Nothing after cookies and refresh-token storage are updated.
 * @example await issueAuthCookies(res, user)
 */
export const issueAuthCookies = async (
  res: Response,
  user: AuthenticatedSessionUser,
): Promise<void> => {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  await storeRefreshToken(user.id, refreshToken)
  res.cookie(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    getCookieOptions(accessToken),
  )
  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    getRefreshCookieOptions(refreshToken),
  )
}

/**
 * Rotates a valid refresh token and returns the authenticated user.
 *
 * Called after an access token expires, replacing both cookies and revoking the
 * consumed refresh token.
 *
 * @param res - Express response used to set replacement cookies.
 * @param refreshToken - Raw refresh token cookie value.
 * @returns Current user when refresh succeeds, otherwise null.
 * @example await rotateRefreshSession(res, refreshToken)
 */
const rotateRefreshSession = async (
  res: Response,
  refreshToken: JWTtoken | undefined,
): Promise<AuthenticatedSessionUser | null> => {
  if (!refreshToken) return null

  const decoded = verifyRefreshToken(refreshToken)
  const tokenHash = hashToken(refreshToken)
  const user = await findUserForTokenPayload(decoded)
  if (!user) {
    await revokeRefreshToken(refreshToken)
    return null
  }

  const accessToken = generateAccessToken(user)
  const nextRefreshToken = generateRefreshToken(user)

  // Rotation is atomic and single-use; replays cannot mint a successor token.
  const rotated = await prisma.$transaction(async (tx) => {
    const { count } = await tx.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      data: { revokedAt: new Date() },
    })

    if (count !== 1) return false

    await tx.refreshToken.create({
      data: {
        tokenHash: hashToken(nextRefreshToken),
        userId: user.id,
        expiresAt: getTokenExpiration(nextRefreshToken),
      },
    })

    return true
  })

  if (!rotated) return null

  res.cookie(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    getCookieOptions(accessToken),
  )
  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    nextRefreshToken,
    getRefreshCookieOptions(nextRefreshToken),
  )

  return user
}

/**
 * Authenticates a request using access cookies with refresh fallback.
 *
 * Called by protected route middleware and account endpoints. A valid access
 * token returns immediately; an expired/missing access token can be recovered by
 * a valid DB-backed refresh token.
 *
 * @param req - Express request containing auth cookies.
 * @param res - Express response used when refresh rotation sets cookies.
 * @returns Authenticated user or a response-ready failure description.
 * @example await authenticateRequestSession(req, res)
 */
export const authenticateRequestSession = async (
  req: Request,
  res: Response,
): Promise<AuthSessionResult> => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME] as
    | JWTtoken
    | undefined
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as
    | JWTtoken
    | undefined

  if (accessToken) {
    try {
      const user = await findUserForTokenPayload(verifyAccessToken(accessToken))

      if (user) return { ok: true, user }

      Logger.info('Stale access token rejected')
      clearAuthCookies(res)
      return { ok: false, status: 401, message: 'Invalid or expired token' }
    } catch (error) {
      if (!(error instanceof TokenExpiredError)) {
        if (isJwtVerificationError(error)) {
          clearAuthCookies(res)
          return { ok: false, status: 401, message: 'Invalid or expired token' }
        }

        Logger.error(error)
        return { ok: false, status: 500, message: 'Authentication failed' }
      }
    }
  }

  try {
    const refreshedUser = await rotateRefreshSession(res, refreshToken)

    if (refreshedUser) return { ok: true, user: refreshedUser }
  } catch (error) {
    if (!isJwtVerificationError(error)) {
      Logger.error(error)
      return { ok: false, status: 500, message: 'Authentication failed' }
    }
  }

  clearAuthCookies(res)
  return {
    ok: false,
    status: 401,
    message:
      accessToken || refreshToken
        ? 'Invalid or expired token'
        : 'No token found',
  }
}

/**
 * Extracts the raw bearer token from an `Authorization` header value.
 *
 * Called by PAT stock-write auth before hashing, so a missing or malformed header
 * fails closed as unauthenticated (401) instead of throwing (500) — the U6 guard.
 *
 * @param authorizationHeader - Raw `Authorization` header (`Bearer <token>`) or undefined.
 * @returns
 * - The trimmed token when the header is a non-empty `Bearer <token>`
 * - null when the header is missing, not a Bearer scheme, or carries an empty token
 * @example
 * extractBearerToken('Bearer nsx_pat_abc') // => 'nsx_pat_abc'
 * extractBearerToken('Basic xyz')          // => null
 */
const extractBearerToken = (
  authorizationHeader: string | undefined,
): string | null => {
  if (typeof authorizationHeader !== 'string') return null

  const bearerMatch = authorizationHeader.match(/^Bearer (.+)$/)
  if (!bearerMatch) return null

  const rawToken = bearerMatch[1].trim()
  return rawToken.length > 0 ? rawToken : null
}

/**
 * Authenticates a stock-write request that presents a Personal Access Token.
 *
 * Called by the `authenticateStockRequest` middleware whenever an `Authorization`
 * header is present. Validates the PAT in a single atomic query (not revoked, not
 * expired) and hydrates the full session user in the same round-trip. It NEVER reads
 * or clears auth cookies, so an invalid PAT cannot evict the owner's browser session
 * (the U5 confused-deputy guard).
 *
 * @param authorizationHeader - Raw `Authorization` header value (`Bearer nsx_pat_<raw>`).
 * @returns
 * - `{ ok: true, user }` with the fully-hydrated owner when the PAT is valid
 * - `{ ok: false, status: 401, message }` when the header is malformed, or the PAT is
 *   unknown, revoked, or expired
 * @example await authenticateStockPatToken(req.headers.authorization)
 */
export const authenticateStockPatToken = async (
  authorizationHeader: string | undefined,
): Promise<AuthSessionResult> => {
  const rawToken = extractBearerToken(authorizationHeader)
  if (!rawToken) {
    return {
      ok: false,
      status: 401,
      message: 'Invalid or missing access token',
    }
  }

  const now = new Date()
  // Single atomic validity check: unknown / revoked / expired all collapse to
  // "no row" -> 401. The owner is hydrated in the same query (E4 full session user).
  const personalAccessToken = await prisma.personalAccessToken.findFirst({
    where: {
      tokenHash: hashToken(rawToken),
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    select: { id: true, user: { select: SESSION_USER_SELECT } },
  })

  if (!personalAccessToken) {
    return { ok: false, status: 401, message: 'Invalid or expired token' }
  }

  // Best-effort last-used bookkeeping, kept as a separate write so it never widens
  // the atomic validation query above.
  await prisma.personalAccessToken.update({
    where: { id: personalAccessToken.id },
    data: { lastUsedAt: now },
  })

  return { ok: true, user: personalAccessToken.user }
}
