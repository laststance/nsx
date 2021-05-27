import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Model } from 'sequelize'
import { Author, Post } from './DB/sequelize'
import { Post as PostType } from '../DataStructure'
import bcrypt from 'bcrypt'

const app = express()

app.use(bodyParser())
app.use(cors())

app.get(
  '/api/posts',
  async (req: Request, res: Response<Model<PostType>[]>) => {
    const posts = await Post.findAll<Model<PostType>>({
      include: { model: Author, as: 'author' },
      attributes: { exclude: ['authorId'] },
      order: [['id', 'DESC']],
    })

    res.json(posts)
  }
)

app.get('/api/post/:id', async (req: Request, res: Response) => {
  const post = await Post.findOne({
    where: { id: req.params.id },
    include: { model: Author, as: 'author' },
    attributes: { exclude: ['authorId'] },
  })

  res.json(post)
})

app.post('/api/signup', async (req: Request, res: Response) => {
  const body = req.body
  if (!(body?.name && body?.password)) {
    return res.status(400).json({ error: 'Data not formatted properly' })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(body.password, salt)

  try {
    const author = await Author.create({
      name: body.name,
      password: hash,
    })

    res.status(201).json({ author })
  } catch (error) {
    res.send(500)
  }
})

app.post('/api/login', async (req: Request, res: Response) => {
  const body = req.body
  const author = await Author.findOne({
    where: { name: body.name },
  })
  if (author) {
    // @ts-ignore
    const validPassword = await bcrypt.compare(body.password, author.password)

    if (validPassword) {
      res.status(200).json({ author })
    } else {
      res.status(400).json({ error: 'Invalid Password' })
    }
  } else {
    res.status(401).json({ error: 'User does not exist' })
  }
})

app.post('/api/create', async (req: Request, res: Response) => {
  const body = req.body
  try {
    const newPost = await Post.create({
      title: body.title,
      body: body.body,
      authorId: body.authorId,
    })

    res.status(201).send(newPost)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    res.send(500)
  }
})

app.post('/api/update', async (req: Request, res: Response) => {
  const body = req.body
  try {
    await Post.update(
      { title: body.title, body: body.body },
      { where: { id: body.postId } }
    )

    res.status(200).send('success')
  } catch (error) {
    res.send(500)
  }
})

/**
 * ==============================================
 * Run server
 * ==============================================
 */
const port = 4000 || process.env.port

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API Server listening on port ${port}!`)
})
