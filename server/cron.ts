import { CronJob } from 'cron'

import Logger from './lib/Logger'
import { prisma } from './prisma'

interface CronInterface {
  readList: InstanceType<typeof CronJob>
}

const READLIST_CRON_NAME = 'daily-readlist'
const READLIST_CRON_TIME = '0 0 * * *'
const READLIST_CRON_TIMEZONE = 'Asia/Tokyo'

type StockRow = Awaited<ReturnType<typeof prisma.stock.findMany>>[number]

export const Cron: CronInterface = {
  readList: CronJob.from({
    cronTime: READLIST_CRON_TIME,
    errorHandler: reportReadlistCronFailure,
    name: READLIST_CRON_NAME,
    onTick: postReadlist,
    start: true,
    timeZone: READLIST_CRON_TIMEZONE,
    waitForCompletion: true,
  }),
}

/**
 * Groups saved stock rows by owner before creating daily posts.
 *
 * Called by the readlist cron transaction so each user receives one post and
 * only their consumed stock rows are removed.
 *
 * @param stocks - Stock rows selected inside the cron transaction.
 * @returns A map keyed by user ID with that user's pending stocks.
 * @example groupStocksByUser([{ userId: 1 } as StockRow])
 */
const groupStocksByUser = (stocks: StockRow[]): Map<number, StockRow[]> => {
  const stocksByUser = new Map<number, StockRow[]>()

  for (const stock of stocks) {
    // Append each stock to its owner bucket for per-user post creation.
    const userStocks = stocksByUser.get(stock.userId) ?? []
    userStocks.push(stock)
    stocksByUser.set(stock.userId, userStocks)
  }

  return stocksByUser
}

/**
 * Escapes page titles for Markdown link text.
 *
 * Called before composing readlist links so bracket characters in article
 * titles cannot terminate the Markdown label early.
 *
 * @param text - Raw saved page title.
 * @returns Markdown-safe link label text.
 * @example escapeMarkdownLinkText('A [draft]') // => 'A \\[draft\\]'
 */
const escapeMarkdownLinkText = (text: string): string => {
  return text.replace(/\[/g, '\\[').replace(/\]/g, '\\]')
}

/**
 * Escapes URLs for Markdown inline link destinations.
 *
 * Called before composing readlist links so closing parentheses inside URLs do
 * not terminate the Markdown destination early.
 *
 * @param url - Raw saved page URL.
 * @returns Markdown-safe URL destination.
 * @example escapeMarkdownUrl('https://example.com/a)') // => 'https://example.com/a%29'
 */
const escapeMarkdownUrl = (url: string): string => {
  return url.replace(/\)/g, '%29')
}

/**
 * Builds the markdown body for a daily readlist post.
 *
 * Called once per user after their pending stock rows are grouped.
 *
 * @param stocks - Stock rows owned by one user.
 * @returns Markdown links separated by blank lines.
 * @example buildReadlistBody([{ pageTitle: 'Example', url: 'https://example.com' } as StockRow])
 */
const buildReadlistBody = (stocks: StockRow[]): string => {
  return stocks
    .map((stock) => {
      const pageTitle = escapeMarkdownLinkText(stock.pageTitle)
      const url = escapeMarkdownUrl(stock.url)

      return `[${pageTitle}](${url})  \n\n`
    })
    .join('')
}

/**
 * Reports cron failures to the current monitoring sink.
 *
 * Called both from the cron error handler and the readlist catch block so
 * failures are visible even when the scheduler swallows callback errors.
 *
 * @param error - Unknown error raised by the cron callback.
 * @returns Nothing after logging structured cron context.
 * @example reportReadlistCronFailure(new Error('database unavailable'))
 */
function reportReadlistCronFailure(error: unknown): void {
  Logger.error('Daily readlist cron failed', {
    error,
    job: READLIST_CRON_NAME,
  })
}

/**
 * Converts each user's saved stock list into a daily post.
 *
 * Triggered by the midnight cron job; groups rows by owner so resource
 * ownership remains intact when stocks become posts.
 *
 * @returns Nothing after all pending stock rows are posted and cleared.
 * @example await postReadlist()
 */
async function postReadlist() {
  Logger.info('Starting daily readlist cron', { job: READLIST_CRON_NAME })

  try {
    const result = await prisma.$transaction(async (tx) => {
      const stocks = await tx.stock.findMany({ orderBy: { id: 'asc' } })

      if (stocks.length === 0) {
        return { postCount: 0, stockCount: 0 }
      }

      const stocksByUser = groupStocksByUser(stocks)
      let postCount = 0

      for (const [userId, userStocks] of stocksByUser) {
        // Delete only the rows that were included in the post snapshot.
        const stockIds = userStocks.map((stock) => stock.id)
        await tx.post.create({
          data: {
            authorId: userId,
            body: buildReadlistBody(userStocks),
            title: `${userStocks[0].pageTitle} etc...`,
          },
        })
        await tx.stock.deleteMany({ where: { id: { in: stockIds } } })
        postCount += 1
      }

      return { postCount, stockCount: stocks.length }
    })

    if (result.stockCount === 0) {
      Logger.info('Daily readlist cron skipped; no stocks found', {
        job: READLIST_CRON_NAME,
      })
      return
    }

    Logger.info('Daily readlist cron completed', {
      job: READLIST_CRON_NAME,
      postCount: result.postCount,
      stockCount: result.stockCount,
    })
  } catch (error) {
    reportReadlistCronFailure(error)
  }
}
