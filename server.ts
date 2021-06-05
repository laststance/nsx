import path from 'path'
import fs from 'fs'
import http from 'http'
import https from 'https'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import { Model } from 'sequelize'
import { Author, Post } from './DB/sequelize'
import { Post as PostType } from './DataStructure'

const isProd: boolean = process.env.NODE_ENV === 'production'
const isDev: boolean = process.env.NODE_ENV === 'development'

const app = express()

// @ts-ignore
app.use(bodyParser())
app.use(cors())

/**
 * ==============================================
 * API Implementation
 * ==============================================
 */
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
 * Prod Server
 * ==============================================
 */
if (isProd) {
  app.use('/', express.static(path.join(__dirname, '../build')))

  const privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/digitalstrength.dev/privkey.pem',
    'utf8'
  )
  const certificate = fs.readFileSync(
    '/etc/letsencrypt/live/digitalstrength.dev/cert.pem',
    'utf8'
  )
  const ca = fs.readFileSync(
    '/etc/letsencrypt/live/digitalstrength.dev/chain.pem',
    'utf8'
  )

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  }

  const httpServer = http.createServer(app)
  const httpsServer = https.createServer(credentials, app)

  httpServer.listen(80, () => {
    // eslint-disable-next-line no-console
    console.log('HTTP Server running on port 80')
  })

  httpsServer.listen(443, () => {
    // eslint-disable-next-line no-console
    console.log('HTTPS Server running on port 443')
  })
}

/**
 * ==============================================
 * DEV Server
 * ==============================================
 */
if (isDev) {
  app.listen(4000, () => {
    // eslint-disable-next-line no-console
    console.log(`Express DEV Server listening on port 4000!`)
  })
}
