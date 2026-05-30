import type { Request, Response } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { hashToken } from '../lib/authSession'
import { prisma } from '../prisma'

import {
  mintPersonalAccessTokenHandler,
  listPersonalAccessTokensHandler,
  revokePersonalAccessTokenHandler,
} from './personalAccessToken'

// DB-free: prisma is mocked so the server vitest project stays in Node (no DATABASE_URL).
// vitest hoists this vi.mock above the imports, so `prisma` above is the mock.
vi.mock('../prisma', () => ({
  prisma: {
    personalAccessToken: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}))

const createMock = vi.mocked(prisma.personalAccessToken.create)
const findManyMock = vi.mocked(prisma.personalAccessToken.findMany)
const findFirstMock = vi.mocked(prisma.personalAccessToken.findFirst)
const updateMock = vi.mocked(prisma.personalAccessToken.update)

const OWNER_ID = 7

/**
 * Builds an Express response double whose chainable methods are spies.
 * @returns A response with `status`/`json` as chainable `vi.fn()`s.
 * @example const res = buildResponse(); expect(res.status).toHaveBeenCalledWith(201)
 */
const buildResponse = (): Response => {
  const res = {} as Response
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('mintPersonalAccessTokenHandler', () => {
  it('returns a freshly generated raw token once and stores only its hash', async () => {
    // Arrange
    createMock.mockResolvedValue({
      id: 1,
      name: 'Chrome extension',
      tokenSuffix: '0000',
      createdAt: new Date('2026-05-30T00:00:00.000Z'),
    } as never)
    const req = {
      authenticatedUser: { id: OWNER_ID },
      body: { name: 'Chrome extension' },
    } as unknown as Request
    const res = buildResponse()

    // Act
    await mintPersonalAccessTokenHandler(req, res)

    // Assert — 201 with a raw token, and the persisted row holds the hash, never the raw value.
    expect(res.status).toHaveBeenCalledWith(201)
    const responseBody = vi.mocked(res.json).mock.calls[0][0] as {
      token: string
      tokenHash?: string
    }
    expect(responseBody.token).toMatch(/^nsx_pat_[0-9a-f]{64}$/)
    expect(responseBody).not.toHaveProperty('tokenHash')

    const createArgs = createMock.mock.calls[0][0] as {
      data: { tokenHash: string; tokenSuffix: string; userId: number }
    }
    expect(createArgs.data.tokenHash).toBe(hashToken(responseBody.token))
    expect(createArgs.data.tokenHash).not.toBe(responseBody.token)
    expect(createArgs.data.tokenSuffix).toBe(responseBody.token.slice(-4))
    expect(createArgs.data.userId).toBe(OWNER_ID)
  })

  it('responds 401 when there is no authenticated session', async () => {
    // Arrange
    const req = { body: { name: 'x' } } as unknown as Request
    const res = buildResponse()

    // Act
    await mintPersonalAccessTokenHandler(req, res)

    // Assert
    expect(res.status).toHaveBeenCalledWith(401)
    expect(createMock).not.toHaveBeenCalled()
  })
})

describe('listPersonalAccessTokensHandler', () => {
  it('returns the masked token list without ever selecting the hash', async () => {
    // Arrange
    findManyMock.mockResolvedValue([
      {
        id: 1,
        name: 'Chrome extension',
        tokenSuffix: 'abcd',
        createdAt: new Date('2026-05-30T00:00:00.000Z'),
        lastUsedAt: null,
        revokedAt: null,
      },
    ] as never)
    const req = { authenticatedUser: { id: OWNER_ID } } as unknown as Request
    const res = buildResponse()

    // Act
    await listPersonalAccessTokensHandler(req, res)

    // Assert — owner-scoped query that selects the suffix but never the hash/raw value.
    expect(res.status).toHaveBeenCalledWith(200)
    const findManyArgs = findManyMock.mock.calls[0][0] as {
      where: { userId: number }
      select: Record<string, boolean>
    }
    expect(findManyArgs.where).toEqual({ userId: OWNER_ID })
    expect(findManyArgs.select.tokenSuffix).toBe(true)
    expect(findManyArgs.select).not.toHaveProperty('tokenHash')

    const responseBody = vi.mocked(res.json).mock.calls[0][0] as {
      tokens: Array<Record<string, unknown>>
    }
    expect(responseBody.tokens[0]).not.toHaveProperty('tokenHash')
  })
})

describe('revokePersonalAccessTokenHandler', () => {
  it('sets revokedAt and returns it for an owned, active token', async () => {
    // Arrange
    findFirstMock.mockResolvedValue({ id: 5, revokedAt: null } as never)
    const revokedAt = new Date('2026-05-30T12:00:00.000Z')
    updateMock.mockResolvedValue({ id: 5, revokedAt } as never)
    const req = {
      authenticatedUser: { id: OWNER_ID },
      params: { id: '5' },
    } as unknown as Request
    const res = buildResponse()

    // Act
    await revokePersonalAccessTokenHandler(req, res)

    // Assert — owner-scoped lookup, then a single revoking update.
    expect(findFirstMock).toHaveBeenCalledWith({
      where: { id: 5, userId: OWNER_ID },
      select: { id: true, revokedAt: true },
    })
    const updateArgs = updateMock.mock.calls[0][0] as {
      where: { id: number }
      data: { revokedAt: Date }
    }
    expect(updateArgs.where).toEqual({ id: 5 })
    expect(updateArgs.data.revokedAt).toBeInstanceOf(Date)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ id: 5, revokedAt })
  })

  it('responds 404 for a token that is unknown or owned by someone else', async () => {
    // Arrange
    findFirstMock.mockResolvedValue(null as never)
    const req = {
      authenticatedUser: { id: OWNER_ID },
      params: { id: '999' },
    } as unknown as Request
    const res = buildResponse()

    // Act
    await revokePersonalAccessTokenHandler(req, res)

    // Assert
    expect(res.status).toHaveBeenCalledWith(404)
    expect(updateMock).not.toHaveBeenCalled()
  })

  it('is idempotent: re-revoking returns the existing timestamp without a second write', async () => {
    // Arrange
    const revokedAt = new Date('2026-05-01T00:00:00.000Z')
    findFirstMock.mockResolvedValue({ id: 5, revokedAt } as never)
    const req = {
      authenticatedUser: { id: OWNER_ID },
      params: { id: '5' },
    } as unknown as Request
    const res = buildResponse()

    // Act
    await revokePersonalAccessTokenHandler(req, res)

    // Assert
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ id: 5, revokedAt })
    expect(updateMock).not.toHaveBeenCalled()
  })

  it('rejects a non-numeric id with trailing characters as 400 before any DB lookup', async () => {
    // Arrange — "5abc" would parse to 5 under Number.parseInt; the guard must reject it.
    const req = {
      authenticatedUser: { id: OWNER_ID },
      params: { id: '5abc' },
    } as unknown as Request
    const res = buildResponse()

    // Act
    await revokePersonalAccessTokenHandler(req, res)

    // Assert — 400, and the malformed id never reaches the database.
    expect(res.status).toHaveBeenCalledWith(400)
    expect(findFirstMock).not.toHaveBeenCalled()
    expect(updateMock).not.toHaveBeenCalled()
  })
})
