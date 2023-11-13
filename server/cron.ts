import { CronJob } from 'cron'

import { prisma } from './prisma'
interface CronInterface {
  readList: InstanceType<typeof CronJob>
}

export const Cron: CronInterface = {
  readList: new CronJob('0 0 * * *', postReadlist, null, true, 'Asia/Tokyo'),
}

async function postReadlist() {
  const stocks = await prisma.stocks.findMany()
  if (stocks.length === 0) return

  const title = stocks[0].pageTitle + ' etc...'

  let body = ''
  for (const stock of stocks) {
    body += `[${stock.pageTitle}](${stock.url})  \n\n`
  }

  await prisma.posts.create({
    data: {
      title: title,
      body: body,
    },
  })
  await prisma.stocks.deleteMany()
}
