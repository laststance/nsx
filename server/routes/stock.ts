import type { Request, Response, NextFunction, Router } from 'express'
import express from 'express'

import { isAuthorized } from '../auth'
import Logger from '../lib/Logger'
import { prisma } from '../prisma'

const router: Router = express.Router()

router.post(
  '/push_stock',
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    try {
      const stock = await prisma.stock.create({
        data: {
          pageTitle: body.pageTitle,
          url: body.url,
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

router.delete('/stock/:id', isAuthorized, async (req, res) => {
  try {
    await prisma.stock.delete({ where: { id: parseInt(req.params.id, 10) } })
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
