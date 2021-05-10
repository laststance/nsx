import Express, { Request, Response } from 'express'
import cors from 'cors'
import { Post, Author } from './DB/sequelize'
const app = Express()
app.use(cors())

app.get('/posts', async (req: Request, res: Response) => {
  //@ select all posts
  const posts = await Post.findAll({ include: { model: Author, as: 'author' } })
  res.json(posts)
})

app.get('/post/:id', (req: Request, res: Response) => {
  if (req.params.id === '1') {
    res.json({
      id: 1,
      title: 'jack trance',
      body: 'take me away to the post',
      autor: {
        id: 1,
        name: 'kato',
      },
      createdAt: '1609683025845',
      updatedAt: '1609683052915',
    })
  } else if (req.params.id === '2') {
    res.json({
      id: 2,
      title: 'pot of greed',
      body: 'next time down',
      autor: {
        id: 2,
        name: 'odori',
      },
      createdAt: '1609683198726',
      updatedAt: '1609684208831',
    })
  } else {
    res.json({
      code: 500,
      message: 'unexpected error',
    })
  }
})

export default app
