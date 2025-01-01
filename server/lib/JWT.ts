import jwt from 'jsonwebtoken'
import type { authors } from '@prisma/client'

// Generate Access Token
export function generateAccessToken(author: authors) {
  // @TODO replace REFRESH_TOKEN_SECRET with ACCESS_TOKEN_SECRET
  return jwt.sign(author, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '15m',
  })
}

// Generate Refresh Token
export function generateRefreshToken(author: authors) {
  return jwt.sign(author, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d',
  })
}
