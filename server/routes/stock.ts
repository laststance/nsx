import type { Request, Response, NextFunction, Router } from 'express'
import express from 'express'

import { authenticateStockRequest, isAuthorized } from '../auth'
import Logger from '../lib/Logger'
import { pushStockBodySchema, type PushStockBody } from '../lib/requestSchemas'
import { validateBody } from '../lib/validateRequest'
import { prisma } from '../prisma'

const router: Router = express.Router()

const DUPLICATE_STOCK_MESSAGE = 'Already exists'
const INVALID_URL_MESSAGE = 'URL is invalid'
const TITLE_REQUIRED_MESSAGE = 'Title is required'
const URL_REQUIRED_MESSAGE = 'URL is required'

/**
 * Normalizes stock URLs so popup and backend duplicate checks compare the same value.
 * @param url - The incoming URL value from request body or query string.
 * @returns
 * - When url is a string: the URL without one trailing slash
 * - When url is missing or not a string: an empty string
 * @example
 * normalizeStockUrl('https://example.com/') // => 'https://example.com'
 */
const normalizeStockUrl = (url: unknown): string => {
  if (typeof url !== 'string') return ''

  return url.trim().replace(/\/$/, '')
}

/**
 * Normalizes stock titles so empty or whitespace-only values are rejected.
 * @param title - The incoming page title value from the request body.
 * @returns The trimmed page title, or an empty string for invalid input.
 * @example
 * normalizeStockTitle(' Example ') // => 'Example'
 */
const normalizeStockTitle = (title: unknown): string => {
  if (typeof title !== 'string') return ''

  return title.trim()
}

/**
 * Checks URL syntax before saving extension-submitted pages.
 * @param url - The normalized URL string to validate.
 * @returns Whether the URL can be parsed by the platform URL parser.
 * @example
 * isValidStockUrl('https://example.com') // => true
 */
const isValidStockUrl = (url: string): boolean => {
  try {
    new globalThis.URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Finds whether a normalized URL is already in the stock table.
 * @param url - The normalized URL to check.
 * @returns Whether a matching stock row exists.
 * @example
 * await stockUrlExists('https://example.com', 1) // => false
 */
const stockUrlExists = async (
  url: string,
  userId: number,
): Promise<boolean> => {
  const existingStock = await prisma.stock.findFirst({
    where: { url, userId },
  })

  return Boolean(existingStock)
}

/**
 * Checks whether the authenticated user owns a stock row before deletion.
 *
 * Called by the stock delete endpoint to prevent one user from consuming or
 * removing another user's saved page.
 *
 * @param stockId - Stock ID from the route parameter.
 * @param userId - Authenticated user ID from the session cookie.
 * @returns Ownership status for response mapping.
 * @example await getStockOwnershipStatus(1, 1)
 */
const getStockOwnershipStatus = async (
  stockId: number,
  userId: number,
): Promise<'allowed' | 'forbidden' | 'missing'> => {
  const stock = await prisma.stock.findUnique({
    select: { userId: true },
    where: { id: stockId },
  })

  if (!stock) return 'missing'
  if (stock.userId !== userId) return 'forbidden'

  return 'allowed'
}

router.post(
  '/push_stock',
  // PAT (extension) or cookie (web) auth; validateBody stays second (E8).
  authenticateStockRequest,
  validateBody(pushStockBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as PushStockBody
    const pageTitle = normalizeStockTitle(body.pageTitle ?? body.title)
    const normalizedUrl = normalizeStockUrl(body.url)

    try {
      const userId = req.authenticatedUser?.id

      if (!userId) {
        res.status(401).json({ error: 'No token found' })
        return
      }

      // Missing inputs are rejected before touching the database.
      if (!normalizedUrl) {
        res.status(400).json({ error: URL_REQUIRED_MESSAGE })
        return
      }

      if (!pageTitle) {
        res.status(400).json({ error: TITLE_REQUIRED_MESSAGE })
        return
      }

      if (!isValidStockUrl(normalizedUrl)) {
        res.status(400).json({ error: INVALID_URL_MESSAGE })
        return
      }

      // A duplicate page should look saved in the extension instead of creating a row.
      if (await stockUrlExists(normalizedUrl, userId)) {
        res.status(409).json({ error: DUPLICATE_STOCK_MESSAGE })
        return
      }

      const stock = await prisma.stock.create({
        data: {
          pageTitle,
          url: normalizedUrl,
          userId,
        },
      })
      res.status(201).json(stock)
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  },
)

router.get('/stocklist', isAuthorized, async (req, res) => {
  try {
    const userId = req.authenticatedUser?.id

    if (!userId) {
      res.status(401).json({ error: 'No token found' })
      return
    }

    const stockList = await prisma.stock.findMany({ where: { userId } })
    res.status(200).json(stockList)
  } catch (error) {
    Logger.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// PAT-accepting so the popup's on-open duplicate check reaches "connected" (E9).
router.get(
  '/stock/exists',
  authenticateStockRequest,
  async (req, res, next) => {
    const normalizedUrl = normalizeStockUrl(req.query.url)
    const userId = req.authenticatedUser?.id

    if (!userId) {
      res.status(401).json({ error: 'No token found' })
      return
    }

    try {
      // The popup needs a concrete URL to answer whether this page is already saved.
      if (!normalizedUrl) {
        res.status(400).json({ error: URL_REQUIRED_MESSAGE })
        return
      }

      res
        .status(200)
        .json({ exists: await stockUrlExists(normalizedUrl, userId) })
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  },
)

router.delete('/stock/:id', isAuthorized, async (req, res) => {
  try {
    const stockId = parseInt(String(req.params.id), 10)
    const userId = req.authenticatedUser?.id

    if (!userId) {
      res.status(401).json({ error: 'No token found' })
      return
    }

    const ownership = await getStockOwnershipStatus(stockId, userId)

    // Delete is allowed only for the user who saved the page.
    if (ownership === 'missing') {
      res.status(404).json({ error: 'Stock not found' })
      return
    }

    if (ownership === 'forbidden') {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    await prisma.stock.delete({
      where: { id: stockId },
    })
    res.status(204).send()
  } catch (error: unknown) {
    Logger.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router
