import { CronJob } from 'cron'

import db from './db/models'
import type PostModel from './db/models/postModel'
interface CronInterface {
  readingList: InstanceType<typeof CronJob>
}

export const Cron: CronInterface = {
  readingList: new CronJob(
    '0 0 * * *',
    postReadingList,
    null,
    true,
    'Asia/Tokyo',
  ),
}

async function postReadingList() {
  const Stocks = await db.stock.findAll()
  if (Stocks.length === 0) return

  const title = Stocks[0].pageTitle + ' etc...'

  let body = ''
  for (const stock of Stocks) {
    body += `[${stock.pageTitle}](${stock.url})  \n\n`
  }

  await db.post.create<PostModel>({
    title: title,
    body: body,
  })
  await db.stock.destroy({
    truncate: true,
    where: {},
  })
}
