import jwt from 'jsonwebtoken'
import { describe, it, expect, vi } from 'vitest'

import {
  generateAccessToken,
  getTokenExpiration,
  getCookieOptions,
} from './JWT'

// Mock environment variable
vi.stubEnv('ACCESS_TOKEN_SECRET', 'test-secret')

describe('JWT Functions', () => {
  describe('generateAccessToken', () => {
    it('should generate a token with 7 day expiration', () => {
      const user = {
        id: 1,
        name: 'Test User',
        password: 'hashed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const token = generateAccessToken(user)
      const decoded = jwt.decode(token) as any

      expect(decoded).toBeTruthy()
      expect(decoded.exp).toBeTruthy()

      // Check that expiration is approximately 7 days from now
      const expectedExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      expect(decoded.exp).toBeGreaterThanOrEqual(expectedExp - 10) // Allow 10 second variance
      expect(decoded.exp).toBeLessThanOrEqual(expectedExp + 10)
    })
  })

  describe('getTokenExpiration', () => {
    it('should extract expiration date from JWT token', () => {
      const user = {
        id: 1,
        name: 'Test User',
        password: 'hashed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const token = generateAccessToken(user)
      const expiration = getTokenExpiration(token)

      // Should be approximately 7 days from now
      const expectedDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      const timeDiff = Math.abs(expiration.getTime() - expectedDate.getTime())

      // Allow 10 second variance
      expect(timeDiff).toBeLessThan(10000)
    })

    it('should return default expiration for invalid token', () => {
      const invalidToken = 'invalid.token.here'
      const expiration = getTokenExpiration(invalidToken)

      // Should be approximately 7 days from now
      const expectedDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      const timeDiff = Math.abs(expiration.getTime() - expectedDate.getTime())

      // Allow 10 second variance
      expect(timeDiff).toBeLessThan(10000)
    })
  })

  describe('getCookieOptions', () => {
    it('should return cookie options with correct expiration', () => {
      const user = {
        id: 1,
        name: 'Test User',
        password: 'hashed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const token = generateAccessToken(user)
      const options = getCookieOptions(token)

      expect(options.httpOnly).toBe(true)
      expect(options.secure).toBe(true)
      expect(options.sameSite).toBe('none')
      expect(options.expires).toBeInstanceOf(Date)
      expect(options.maxAge).toBeGreaterThan(0)

      // maxAge should be approximately 7 days in milliseconds
      const expectedMaxAge = 7 * 24 * 60 * 60 * 1000
      expect(options.maxAge).toBeGreaterThan(expectedMaxAge - 10000) // Allow 10 second variance
      expect(options.maxAge).toBeLessThan(expectedMaxAge + 10000)
    })

    it('should handle expired tokens gracefully', () => {
      // Create a token that's already expired
      const expiredPayload = {
        id: 1,
        name: 'Test User',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      }

      const expiredToken = jwt.sign(expiredPayload, 'test-secret')
      const options = getCookieOptions(expiredToken)

      // maxAge should be 0 for expired tokens
      expect(options.maxAge).toBe(0)
    })
  })
})
