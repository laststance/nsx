import Express, { Request, Response } from 'express'
import cors from 'cors'
const app = Express()
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'Express server is working!' })
})

app.get('/posts', (req: Request, res: Response) => {
  // @Todo return hard coded Posts Json
  res.json([
    {
      id: 1,
      title: 'jack trance',
      body: 'take me away to the post',
      autor: {
        id: 1,
        name: 'kato',
      },
      createdAt: '1609683025845',
      updatedAt: '1609683052915',
    },
    {
      id: 2,
      title: 'pot of greed',
      body: 'next time down',
      autor: {
        id: 2,
        name: 'odori',
      },
      createdAt: '1609683198726',
      updatedAt: '1609684208831',
    },
  ])
})

export default app
