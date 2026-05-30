import type { Request, Response, NextFunction } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { authenticateStockRequest } from '../auth'
import { prisma } from '../prisma'

import { hashToken } from './authSession'

// DB-free: prisma is fully mocked so the server vitest project stays in Node with no
// DATABASE_URL. vitest hoists this vi.mock above the imports, so `prisma` here and the
// client reached transitively through `../auth` are both the mock. We assert behavior
// (dispatch, hydrate, no-cookie-clear); the real WHERE clause runs against MySQL at E2E.
vi.mock('../prisma', () => ({
  prisma: {
    personalAccessToken: { findFirst: vi.fn(), update: vi.fn() },
    user: { findFirst: vi.fn() },
    refreshToken: { updateMany: vi.fn(), create: vi.fn() },
  },
}))

const findPatMock = vi.mocked(prisma.personalAccessToken.findFirst)
const updatePatMock = vi.mocked(prisma.personalAccessToken.update)

// A 64-hex-char body → a well-formed `nsx_pat_<64hex>` token.
const VALID_RAW_TOKEN = `nsx_pat_${'abcd1234'.repeat(8)}`

// The full session-user shape the cookie branch hydrates (SESSION_USER_SELECT).
const FULL_SESSION_USER = {
  id: 7,
  name: 'Raphtalia',
  password: 'hashed-password',
  sessionVersion: 3,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-01T00:00:00.000Z'),
  useLegacyHoverColors: false,
}

/**
 * Builds an Express response double whose chainable methods are spies.
 * @returns A response with `status`/`json`/`cookie` as chainable `vi.fn()`s.
 * @example const res = buildResponse(); expect(res.status).toHaveBeenCalledWith(401)
 */
const buildResponse = (): Response => {
  const res = {} as Response
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.cookie = vi.fn().mockReturnValue(res)
  return res
}

/**
 * Builds an Express request double with the given Authorization header + cookies.
 * @param authorization - Raw `Authorization` header value, or undefined to omit it.
 * @param cookies - Cookie jar to expose at `req.cookies` (defaults to empty).
 * @returns A request shaped enough for the stock-write middleware.
 * @example buildRequest(`Bearer ${VALID_RAW_TOKEN}`)
 */
const buildRequest = (
  authorization: string | undefined,
  cookies: Record<string, string> = {},
): Request =>
  ({
    headers: authorization === undefined ? {} : { authorization },
    cookies,
  }) as unknown as Request

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authenticateStockRequest', () => {
  it('authenticates a stock write when a valid Bearer PAT is supplied', async () => {
    // Arrange
    findPatMock.mockResolvedValue({ id: 11, user: FULL_SESSION_USER } as never)
    updatePatMock.mockResolvedValue({} as never)
    const req = buildRequest(`Bearer ${VALID_RAW_TOKEN}`)
    const res = buildResponse()
    const next = vi.fn() as NextFunction

    // Act
    await authenticateStockRequest(req, res, next)

    // Assert
    expect(next).toHaveBeenCalledOnce()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('hydrates req.authenticatedUser with the full session-user shape for a PAT request', async () => {
    // Arrange
    findPatMock.mockResolvedValue({ id: 11, user: FULL_SESSION_USER } as never)
    updatePatMock.mockResolvedValue({} as never)
    const req = buildRequest(`Bearer ${VALID_RAW_TOKEN}`)
    const res = buildResponse()
    const next = vi.fn() as NextFunction

    // Act
    await authenticateStockRequest(req, res, next)

    // Assert
    expect(req.authenticatedUser).toEqual({
      id: 7,
      name: 'Raphtalia',
      password: 'hashed-password',
      sessionVersion: 3,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-02-01T00:00:00.000Z'),
      useLegacyHoverColors: false,
    })
  })

  it('validates the PAT in a single atomic query that excludes revoked and expired tokens', async () => {
    // Arrange
    findPatMock.mockResolvedValue({ id: 11, user: FULL_SESSION_USER } as never)
    updatePatMock.mockResolvedValue({} as never)
    const req = buildRequest(`Bearer ${VALID_RAW_TOKEN}`)
    const res = buildResponse()
    const next = vi.fn() as NextFunction

    // Act
    await authenticateStockRequest(req, res, next)

    // Assert
    expect(findPatMock).toHaveBeenCalledOnce()
    const findArgs = findPatMock.mock.calls[0][0] as {
      where: {
        tokenHash: string
        revokedAt: null
        OR: Array<{ expiresAt: null | { gt: Date } }>
      }
      select: { user: unknown }
    }
    expect(findArgs.where.tokenHash).toBe(hashToken(VALID_RAW_TOKEN))
    expect(findArgs.where.revokedAt).toBeNull()
    expect(findArgs.where.OR).toEqual([
      { expiresAt: null },
      { expiresAt: { gt: expect.any(Date) } },
    ])
    expect(findArgs.select.user).toBeTruthy()
  })

  it('updates lastUsedAt after a successful PAT authentication', async () => {
    // Arrange
    findPatMock.mockResolvedValue({ id: 11, user: FULL_SESSION_USER } as never)
    updatePatMock.mockResolvedValue({} as never)
    const req = buildRequest(`Bearer ${VALID_RAW_TOKEN}`)
    const res = buildResponse()
    const next = vi.fn() as NextFunction

    // Act
    await authenticateStockRequest(req, res, next)

    // Assert
    expect(updatePatMock).toHaveBeenCalledOnce()
    const updateArgs = updatePatMock.mock.calls[0][0] as {
      where: { id: number }
      data: { lastUsedAt: Date }
    }
    expect(updateArgs.where).toEqual({ id: 11 })
    expect(updateArgs.data.lastUsedAt).toBeInstanceOf(Date)
  })

  it('still authenticates the request when the best-effort lastUsedAt write fails', async () => {
    // Arrange — the PAT is valid, but the post-auth lastUsedAt bookkeeping write
    // throws (transient DB hiccup). Authentication already succeeded, so the request
    // must still pass through instead of collapsing into a 500.
    findPatMock.mockResolvedValue({ id: 11, user: FULL_SESSION_USER } as never)
    updatePatMock.mockRejectedValue(new Error('transient write failure'))
    const req = buildRequest(`Bearer ${VALID_RAW_TOKEN}`)
    const res = buildResponse()
    const next = vi.fn() as NextFunction

    // Act
    await authenticateStockRequest(req, res, next)

    // Assert — request proceeds; a post-auth bookkeeping failure never surfaces as 500.
    expect(next).toHaveBeenCalledOnce()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('falls back to the existing cookie session when no Authorization header is present', async () => {
    // Arrange — no Authorization header and no auth cookies.
    const req = buildRequest(undefined, {})
    const res = buildResponse()
    const next = vi.fn() as NextFunction

    // Act
    await authenticateStockRequest(req, res, next)

    // Assert — the cookie path ran (its "No token found" 401), never the PAT lookup.
    expect(findPatMock).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'No token found' })
  })

  it('responds 401 without clearing auth cookies when the Bearer PAT is invalid or revoked', async () => {
    // Arrange — a Bearer PAT that matches no active row, alongside live auth cookies.
    findPatMock.mockResolvedValue(null as never)
    const req = buildRequest(`Bearer ${VALID_RAW_TOKEN}`, {
      accessToken: 'owner-access-cookie',
      refreshToken: 'owner-refresh-cookie',
    })
    const res = buildResponse()
    const next = vi.fn() as NextFunction

    // Act
    await authenticateStockRequest(req, res, next)

    // Assert — 401, and the owner's cookies are left untouched (confused-deputy guard).
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
    expect(res.cookie).not.toHaveBeenCalled()
  })

  it('responds 401 rather than 500 when the Authorization header is malformed', async () => {
    // Arrange — a header that is present but not a usable Bearer token.
    const req = buildRequest('NotBearer whatever')
    const res = buildResponse()
    const next = vi.fn() as NextFunction

    // Act
    await authenticateStockRequest(req, res, next)

    // Assert — client error, never a server error, and no DB lookup is attempted.
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status).not.toHaveBeenCalledWith(500)
    expect(findPatMock).not.toHaveBeenCalled()
    expect(res.cookie).not.toHaveBeenCalled()
  })
})
