import type { authors } from '@prisma/client'
import type { CookieOptions } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'

// Generate Access Token
export function generateAccessToken(author: authors) {
  return jwt.sign(author, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15m',
  })
}

// Verify Access Token
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
  ) as JwtPayload
}

export function deleteJWTattribute(payload: JwtPayload) {
  delete payload.iat
  delete payload.exp
  delete payload.nbf
  delete payload.jti
  delete payload.jwtid
  return payload
}

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  sameSite: 'none',
  secure: true,
}
