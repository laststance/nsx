import type { NextFunction, Request, Response, Router } from 'express'
import express from 'express'

import { validationError, notFoundError } from '../lib/apiErrors'
import {
  apiErrorHandler,
  createPaginationMeta,
  sendSuccess,
} from '../lib/apiResponses'
import Logger from '../lib/Logger'
import { prisma } from '../prisma'

const router: Router = express.Router()

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 10
const MAX_PER_PAGE = 100

const openApiDocument = {
  components: {
    schemas: {
      ApiError: {
        properties: {
          code: { example: 'NOT_FOUND', type: 'string' },
          error: { example: 'Post not found', type: 'string' },
          requestId: { type: 'string' },
          success: { example: false, type: 'boolean' },
          timestamp: { format: 'date-time', type: 'string' },
        },
        required: ['success', 'error', 'code', 'timestamp'],
        type: 'object',
      },
      ApiSuccess: {
        properties: {
          data: { type: 'object' },
          requestId: { type: 'string' },
          success: { example: true, type: 'boolean' },
          timestamp: { format: 'date-time', type: 'string' },
        },
        required: ['success', 'data', 'timestamp'],
        type: 'object',
      },
    },
  },
  info: {
    description: 'Versioned NSX API with standardized response envelopes.',
    title: 'NSX API',
    version: '1.0.0',
  },
  openapi: '3.0.0',
  paths: {
    '/api/v1/posts': {
      get: {
        responses: {
          '200': { description: 'Paginated posts response' },
          '400': { description: 'Invalid pagination query' },
        },
        summary: 'List posts',
      },
    },
    '/api/v1/posts/{id}': {
      get: {
        responses: {
          '200': { description: 'Post response' },
          '400': { description: 'Invalid post ID' },
          '404': { description: 'Post not found' },
        },
        summary: 'Get a post',
      },
    },
    '/api/v1/users/count': {
      get: {
        responses: {
          '200': { description: 'User count response' },
        },
        summary: 'Count users',
      },
    },
  },
  servers: [
    { url: 'https://nsx.malloc.tokyo' },
    { url: 'http://localhost:4000' },
  ],
}

/**
 * Parses a positive integer query value with a bounded fallback.
 * @param value - Raw query value from Express.
 * @param fallback - Number used when the query value is absent.
 * @param maxValue - Optional maximum accepted value.
 * @returns Positive integer ready for Prisma pagination.
 * @example parsePositiveInteger('2', 1, 100) // => 2
 */
const parsePositiveInteger = (
  value: unknown,
  fallback: number,
  maxValue?: number,
): number => {
  if (value === undefined) return fallback
  if (typeof value !== 'string') throw validationError('Query must be a string')

  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw validationError('Query must be a positive integer')
  }

  if (maxValue && parsedValue > maxValue) {
    throw validationError(`Query must be less than or equal to ${maxValue}`)
  }

  return parsedValue
}

/**
 * Parses a route ID into a positive integer.
 * @param value - Raw path parameter from Express.
 * @returns Positive integer ID for Prisma lookups.
 * @example parseRouteId('42') // => 42
 */
const parseRouteId = (value: unknown): number => {
  if (typeof value !== 'string') throw validationError('Route id is required')

  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw validationError('Route id must be a positive integer')
  }

  return parsedValue
}

/**
 * Converts unmatched API v1 URLs into the standardized JSON 404 shape.
 * @param _req - Express request that reached the v1 fallback.
 * @param _res - Unused response; the error handler sends the JSON response.
 * @param next - Express continuation receiving the not-found error.
 * @returns Nothing; forwards a Route not found error.
 * @example router.use('/v1', handleMissingV1Route)
 */
const handleMissingV1Route = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(notFoundError('Route'))
}

router.get('/v1/openapi.json', (_req: Request, res: Response) => {
  sendSuccess(res, openApiDocument)
})

router.get(
  '/v1/users/count',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const userCount = await prisma.user.count()
      sendSuccess(res, { userCount }, { message: 'User count retrieved' })
    } catch (error: unknown) {
      Logger.error('API v1 user count route failed', {
        error,
        route: '/api/v1/users/count',
      })
      next(error)
    }
  },
)

router.get(
  '/v1/posts',
  async (
    req: Request<
      _,
      _,
      _,
      {
        page?: string
        perPage?: string
      }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parsePositiveInteger(req.query.page, DEFAULT_PAGE)
      const perPage = parsePositiveInteger(
        req.query.perPage,
        DEFAULT_PER_PAGE,
        MAX_PER_PAGE,
      )
      const total = await prisma.post.count()
      const posts = await prisma.post.findMany({
        orderBy: { id: 'desc' },
        skip: perPage * (page - 1),
        take: perPage,
      })

      sendSuccess(res, posts, {
        message: 'Posts retrieved',
        meta: {
          pagination: createPaginationMeta(page, perPage, total),
        },
      })
    } catch (error: unknown) {
      Logger.error('API v1 posts route failed', {
        error,
        query: req.query,
        route: '/api/v1/posts',
      })
      next(error)
    }
  },
)

router.get(
  '/v1/posts/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = parseRouteId(req.params.id)
      const post = await prisma.post.findUnique({
        where: { id: postId },
      })

      if (!post) {
        throw notFoundError('Post')
      }

      sendSuccess(res, post, { message: 'Post retrieved' })
    } catch (error: unknown) {
      Logger.error('API v1 post route failed', {
        error,
        params: req.params,
        route: '/api/v1/posts/:id',
      })
      next(error)
    }
  },
)

router.use('/v1', handleMissingV1Route)

router.use(apiErrorHandler)

export default router
