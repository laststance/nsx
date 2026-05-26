import type { CookieOptions } from 'express'
import jwt, { type JwtPayload, TokenExpiredError } from 'jsonwebtoken'

import type { User } from '../../generated/prisma/client'

export const ACCESS_TOKEN_COOKIE_NAME = 'token'
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'
export const ACCESS_TOKEN_EXPIRES_IN = '1h'
export const REFRESH_TOKEN_EXPIRES_IN = '7d'

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
 * Called when issuing or verifying refresh cookies; falls back to the access
 * token secret so existing environments keep working until configured.
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
 * Generate the short-lived access token stored in the `token` cookie.
 *
 * Called by login, signup, and refresh rotation after a user is authenticated.
 *
 * @param user - User record used as the JWT payload.
 * @returns Signed JWT that expires after one hour.
 * @example generateAccessToken(user)
 */
export function generateAccessToken(user: ExtendedUser): JWTtoken {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  })
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
  return jwt.sign(user, getRefreshTokenSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
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
export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as JwtPayload
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
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, getRefreshTokenSecret()) as JwtPayload
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
  return getCookieOptions(token)
}
