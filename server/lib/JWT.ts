import type { authors } from '@prisma/client'
import type { CookieOptions } from 'express'
import jwt, { type JwtPayload, TokenExpiredError } from 'jsonwebtoken'

// Generate Access Token
export function generateAccessToken(author: authors) {
  return jwt.sign(author, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '7d',
  })
}

// Get expiration date from JWT token
export function getTokenExpiration(token: string): Date {
  const decoded = jwt.decode(token) as JwtPayload
  if (decoded?.exp) {
    // exp is in seconds, convert to milliseconds
    return new Date(decoded.exp * 1000)
  }
  // Default to 7 days if no exp claim
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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

  return {
    httpOnly: true,
    expires: expiration,
    maxAge: maxAge > 0 ? maxAge : 0,
    sameSite: 'none',
    secure: true,
  }
}

// Legacy static cookie options (to be removed)
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
  sameSite: 'none',
  secure: true,
}
