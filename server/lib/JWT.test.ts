import jwt from 'jsonwebtoken'
import { describe, it, expect, vi } from 'vitest'

import {
  generateRefreshToken,
  generateAccessToken,
  getTokenExpiration,
  getCookieOptions,
  getRefreshCookieOptions,
} from './JWT'

// Mock environment variable
vi.stubEnv('ACCESS_TOKEN_SECRET', 'test-secret')
vi.stubEnv('REFRESH_TOKEN_SECRET', 'test-refresh-secret')

describe('JWT Functions', () => {
  describe('generateAccessToken', () => {
    it('sets access tokens to expire after one hour', () => {
      // Arrange
      const user = {
        id: 1,
        name: 'Test User',
        password: 'hashed',
        sessionVersion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        useLegacyHoverColors: false,
      }

      // Act
      const token = generateAccessToken(user)
      const decoded = jwt.decode(token) as any

      // Assert
      expect(decoded).toBeTruthy()
      expect(decoded.exp).toBeTruthy()
      expect(decoded).toMatchObject({
        kind: 'access',
        sessionVersion: 0,
        sub: '1',
      })
      expect(decoded.password).toBeUndefined()

      const expectedExp = Math.floor(Date.now() / 1000) + 60 * 60
      expect(decoded.exp).toBeGreaterThanOrEqual(expectedExp - 10)
      expect(decoded.exp).toBeLessThanOrEqual(expectedExp + 10)
    })
  })

  describe('generateRefreshToken', () => {
    it('sets refresh tokens to expire after seven days', () => {
      // Arrange
      const user = {
        id: 1,
        name: 'Test User',
        password: 'hashed',
        sessionVersion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        useLegacyHoverColors: false,
      }

      // Act
      const token = generateRefreshToken(user)
      const decoded = jwt.decode(token) as any

      // Assert
      expect(decoded).toBeTruthy()
      expect(decoded.exp).toBeTruthy()
      expect(decoded).toMatchObject({
        kind: 'refresh',
        sessionVersion: 0,
        sub: '1',
      })
      expect(decoded.jti).toEqual(expect.any(String))
      expect(decoded.password).toBeUndefined()

      const expectedExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      expect(decoded.exp).toBeGreaterThanOrEqual(expectedExp - 10)
      expect(decoded.exp).toBeLessThanOrEqual(expectedExp + 10)
    })

    it('uses unique token IDs so same-second refresh rotations do not collide', () => {
      // Arrange
      const user = {
        id: 1,
        name: 'Test User',
        password: 'hashed',
        sessionVersion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        useLegacyHoverColors: false,
      }

      // Act
      const firstToken = generateRefreshToken(user)
      const secondToken = generateRefreshToken(user)
      const firstDecoded = jwt.decode(firstToken) as any
      const secondDecoded = jwt.decode(secondToken) as any

      // Assert
      expect(secondToken).not.toBe(firstToken)
      expect(secondDecoded.jti).not.toBe(firstDecoded.jti)
    })
  })

  describe('getTokenExpiration', () => {
    it('extracts expiration date from a signed access token', () => {
      // Arrange
      const user = {
        id: 1,
        name: 'Test User',
        password: 'hashed',
        sessionVersion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        useLegacyHoverColors: false,
      }

      // Act
      const token = generateAccessToken(user)
      const expiration = getTokenExpiration(token)

      // Assert
      const expectedDate = new Date(Date.now() + 60 * 60 * 1000)
      const timeDiff = Math.abs(expiration.getTime() - expectedDate.getTime())

      expect(timeDiff).toBeLessThan(10000)
    })

    it('defaults invalid token expiration to one hour', () => {
      // Arrange
      const invalidToken = 'invalid.token.here'

      // Act
      const expiration = getTokenExpiration(invalidToken)

      // Assert
      const expectedDate = new Date(Date.now() + 60 * 60 * 1000)
      const timeDiff = Math.abs(expiration.getTime() - expectedDate.getTime())

      expect(timeDiff).toBeLessThan(10000)
    })
  })

  describe('getCookieOptions', () => {
    it('aligns the cookie lifetime with the access token lifetime', () => {
      // Arrange
      const user = {
        id: 1,
        name: 'Test User',
        password: 'hashed',
        sessionVersion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        useLegacyHoverColors: false,
      }

      // Act
      const token = generateAccessToken(user)
      const options = getCookieOptions(token)

      // Assert
      expect(options.httpOnly).toBe(true)
      expect(options.secure).toBe(false)
      expect(options.sameSite).toBe('lax')
      expect(options.expires).toBeInstanceOf(Date)
      expect(options.maxAge).toBeGreaterThan(0)

      const expectedMaxAge = 60 * 60 * 1000
      expect(options.maxAge).toBeGreaterThan(expectedMaxAge - 10000)
      expect(options.maxAge).toBeLessThan(expectedMaxAge + 10000)
    })

    it('sets zero maxAge for expired tokens', () => {
      // Arrange
      const expiredPayload = {
        id: 1,
        name: 'Test User',
        exp: Math.floor(Date.now() / 1000) - 3600,
      }

      // Act
      const expiredToken = jwt.sign(expiredPayload, 'test-secret')
      const options = getCookieOptions(expiredToken)

      // Assert
      expect(options.maxAge).toBe(0)
    })

    it('uses strict sameSite for refresh cookies', () => {
      // Arrange
      const user = {
        id: 1,
        name: 'Test User',
        password: 'hashed',
        sessionVersion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        useLegacyHoverColors: false,
      }

      // Act
      const token = generateRefreshToken(user)
      const options = getRefreshCookieOptions(token)

      // Assert
      expect(options.httpOnly).toBe(true)
      expect(options.secure).toBe(false)
      expect(options.sameSite).toBe('strict')
      expect(options.maxAge).toBeGreaterThan(7 * 24 * 60 * 60 * 1000 - 10000)
      expect(options.maxAge).toBeLessThan(7 * 24 * 60 * 60 * 1000 + 10000)
    })
  })
})
