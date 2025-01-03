import type { authors } from '@prisma/client'
import jwt, { type JwtPayload } from 'jsonwebtoken'

// Generate Access Token
export function generateAccessToken(author: authors) {
  return jwt.sign(author, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15m',
  })
}

// Generate Refresh Token
export function generateRefreshToken(author: authors) {
  return jwt.sign(author, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d',
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
