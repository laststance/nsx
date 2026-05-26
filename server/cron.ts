import { CronJob } from 'cron'

import { prisma } from './prisma'
interface CronInterface {
  readList: InstanceType<typeof CronJob>
}

export const Cron: CronInterface = {
  readList: new CronJob('0 0 * * *', postReadlist, null, true, 'Asia/Tokyo'),
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
  const stocks = await prisma.stock.findMany()
  if (stocks.length === 0) return

  const stocksByUser = new Map<number, typeof stocks>()

  for (const stock of stocks) {
    const userStocks = stocksByUser.get(stock.userId) ?? []
    userStocks.push(stock)
    stocksByUser.set(stock.userId, userStocks)
  }

  for (const [userId, userStocks] of stocksByUser) {
    const title = userStocks[0].pageTitle + ' etc...'
    let body = ''

    for (const stock of userStocks) {
      body += `[${stock.pageTitle}](${stock.url})  \n\n`
    }

    await prisma.$transaction([
      prisma.post.create({
        data: {
          authorId: userId,
          title,
          body,
        },
      }),
      prisma.stock.deleteMany({ where: { userId } }),
    ])
  }
}
