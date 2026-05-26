import type { Request, Response, NextFunction, Router } from 'express'
import express from 'express'

import { isAuthorized } from '../auth'
import Logger from '../lib/Logger'
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
 * await stockUrlExists('https://example.com') // => false
 */
const stockUrlExists = async (url: string): Promise<boolean> => {
  const existingStock = await prisma.stock.findFirst({
    where: { url },
  })

  return Boolean(existingStock)
}

router.post(
  '/push_stock',
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const pageTitle = normalizeStockTitle(body.pageTitle ?? body.title)
    const normalizedUrl = normalizeStockUrl(body.url)

    try {
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
      if (await stockUrlExists(normalizedUrl)) {
        res.status(409).json({ error: DUPLICATE_STOCK_MESSAGE })
        return
      }

      const stock = await prisma.stock.create({
        data: {
          pageTitle,
          url: normalizedUrl,
        },
      })
      res.status(201).json(stock)
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  },
)

router.get('/stocklist', async (_req, res) => {
  const stockList = await prisma.stock.findMany()
  res.status(200).json(stockList)
})

router.get('/stock/exists', async (req, res, next) => {
  const normalizedUrl = normalizeStockUrl(req.query.url)

  try {
    // The popup needs a concrete URL to answer whether this page is already saved.
    if (!normalizedUrl) {
      res.status(400).json({ error: URL_REQUIRED_MESSAGE })
      return
    }

    res.status(200).json({ exists: await stockUrlExists(normalizedUrl) })
  } catch (error) {
    Logger.error(error)
    next(error)
  }
})

router.delete('/stock/:id', isAuthorized, async (req, res) => {
  try {
    await prisma.stock.delete({
      where: { id: parseInt(String(req.params.id), 10) },
    })
    res.status(200).json({ message: 'Delete Successful!' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(error)
      res.status(500).json({ message: error.message })
    } else {
      Logger.error(error)
      res
        .status(500)
        .json({ message: `someting wrong: ${JSON.stringify(error)}` })
    }
  }
})

export default router
