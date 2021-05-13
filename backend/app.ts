import Express, { Request, Response } from 'express'
import cors from 'cors'
import { Model } from 'sequelize'
import { Post, Author } from './DB/sequelize'
// @TODO find more straightforwardway to use DataStructure's Posts interface.
import { Post as PostType } from '../DataStructure'
const app = Express()
app.use(cors())

app.get('/posts', async (req: Request, res: Response<Model<PostType>[]>) => {
  const posts = await Post.findAll<Model<PostType>>({
    include: { model: Author, as: 'author' },
    attributes: { exclude: ['authorId'] },
  })

  res.json(posts)
})

app.get('/post/:id', async (req: Request, res: Response) => {
  const post = await Post.findOne({
    where: { id: req.params.id },
    include: { model: Author, as: 'author' },
    attributes: { exclude: ['authorId'] },
  })

  res.json(post)
})

export default app
