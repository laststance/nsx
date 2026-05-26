import { randomUUID } from 'node:crypto'

import type { CookieOptions } from 'express'
import jwt, {
  JsonWebTokenError,
  type JwtPayload,
  TokenExpiredError,
} from 'jsonwebtoken'

import type { User } from '../../generated/prisma/client'

export const ACCESS_TOKEN_COOKIE_NAME = 'token'
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'
export const ACCESS_TOKEN_EXPIRES_IN = '1h'
export const REFRESH_TOKEN_EXPIRES_IN = '7d'

type TokenKind = 'access' | 'refresh'
export type AuthTokenPayload = JwtPayload & {
  kind: TokenKind
  sessionVersion: number
  sub: string
}

/**
 * Extended User type that represents the user returned from Prisma with extensions.
 * The Prisma extension converts createdAt and updatedAt from Date to string.
 */
type ExtendedUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: Date | string
  updatedAt: Date | string
}

/**
 * Returns the secret used to sign refresh tokens.
 *
 * Called when issuing or verifying refresh cookies; token-kind validation keeps
 * refresh cookies from being accepted by the access-token verifier.
 *
 * @returns Refresh-token signing secret.
 * @example getRefreshTokenSecret()
 */
const getRefreshTokenSecret = (): string => {
  return (
    process.env.REFRESH_TOKEN_SECRET ??
    (process.env.ACCESS_TOKEN_SECRET as string)
  )
}

/**
 * Builds the minimal user JWT payload shared by access and refresh tokens.
 *
 * Called before signing so password hashes and other user fields never leave
 * the server in a readable JWT body; refresh-token uniqueness is added with
 * the standard `jti` claim during signing.
 *
 * @param user - Authenticated user whose ID/version should be represented.
 * @param kind - Token kind enforced by the verifier.
 * @returns Minimal token claims safe to store in HTTP-only cookies.
 * @example buildTokenPayload(user, 'access')
 */
const buildTokenPayload = (
  user: ExtendedUser,
  kind: TokenKind,
): Omit<AuthTokenPayload, keyof JwtPayload> => {
  return {
    kind,
    sessionVersion: user.sessionVersion,
    sub: String(user.id),
  }
}

/**
 * Verifies that a decoded JWT has the expected token kind.
 *
 * Called by access and refresh verifiers so refresh tokens cannot be replayed
 * as access tokens even if environments share a secret.
 *
 * @param payload - Decoded JWT payload from `jsonwebtoken`.
 * @param kind - Expected token kind for the current verifier.
 * @returns Payload narrowed to the auth-token shape.
 * @example assertTokenKind(payload, 'refresh')
 */
const assertTokenKind = (
  payload: string | JwtPayload,
  kind: TokenKind,
): AuthTokenPayload => {
  if (
    typeof payload === 'string' ||
    payload.kind !== kind ||
    typeof payload.sub !== 'string' ||
    typeof payload.sessionVersion !== 'number'
  ) {
    throw new JsonWebTokenError(`Invalid ${kind} token`)
  }

  return payload as AuthTokenPayload
}

/**
 * Generate the short-lived access token stored in the `token` cookie.
 *
 * Called by login, signup, and refresh rotation after a user is authenticated.
 *
 * @param user - User record used as the JWT payload.
 * @returns Signed JWT that expires after one hour.
 * @example generateAccessToken(user)
 */
export function generateAccessToken(user: ExtendedUser): JWTtoken {
  return jwt.sign(
    buildTokenPayload(user, 'access'),
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  )
}

/**
 * Generate the longer-lived refresh token stored in the `refreshToken` cookie.
 *
 * Called together with `generateAccessToken` and persisted by hashed value so
 * old refresh cookies can be revoked during rotation.
 *
 * @param user - User record used as the refresh JWT payload.
 * @returns Signed JWT that expires after seven days.
 * @example generateRefreshToken(user)
 */
export function generateRefreshToken(user: ExtendedUser): JWTtoken {
  return jwt.sign(buildTokenPayload(user, 'refresh'), getRefreshTokenSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    // Same-second refresh rotations need unique token strings for DB hashes.
    jwtid: randomUUID(),
  })
}

// Get expiration date from JWT token
export function getTokenExpiration(token: string): Date {
  const decoded = jwt.decode(token) as JwtPayload
  if (decoded?.exp) {
    // exp is in seconds, convert to milliseconds
    return new Date(decoded.exp * 1000)
  }
  // Default to one hour if no exp claim is present.
  return new Date(Date.now() + 60 * 60 * 1000)
}

// Verify Access Token
export function verifyAccessToken(token: string): AuthTokenPayload {
  try {
    return assertTokenKind(
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string),
      'access',
    )
  } catch (error) {
    // Explicitly handle expiration errors
    if (error instanceof TokenExpiredError) {
      throw new TokenExpiredError('Token expired', new Date())
    }
    // Other errors are simply rethrown
    throw error
  }
}

/**
 * Verify a refresh token with the refresh-token secret.
 *
 * Called only by the refresh rotation path before checking the hashed token in
 * the database.
 *
 * @param token - Refresh JWT read from the `refreshToken` cookie.
 * @returns Verified JWT payload.
 * @example verifyRefreshToken(refreshToken)
 */
export function verifyRefreshToken(token: string): AuthTokenPayload {
  return assertTokenKind(jwt.verify(token, getRefreshTokenSecret()), 'refresh')
}

export function deleteJWTattribute(payload: JwtPayload) {
  delete payload.iat
  delete payload.exp
  delete payload.nbf
  delete payload.jti
  delete payload.jwtid
  return payload
}

// Get cookie options based on JWT expiration
export function getCookieOptions(token: string): CookieOptions {
  const expiration = getTokenExpiration(token)
  const maxAge = expiration.getTime() - Date.now()

  // In development/test, use secure false to work with HTTP
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    expires: expiration,
    maxAge: maxAge > 0 ? maxAge : 0,
    sameSite: 'lax',
    secure: isProduction,
  }
}

/**
 * Builds cookie options for refresh-token cookies.
 *
 * Called when login/signup/refresh set the longer-lived refresh cookie.
 *
 * @param token - Refresh token whose expiration should drive the cookie.
 * @returns HTTP-only cookie options matching the refresh token lifetime.
 * @example getRefreshCookieOptions(refreshToken)
 */
export function getRefreshCookieOptions(token: string): CookieOptions {
  return {
    ...getCookieOptions(token),
    sameSite: 'strict',
  }
}
