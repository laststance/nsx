import https from 'https'
import fs from 'fs'
import type { Request, Response } from 'express'
import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import type { Model } from 'sequelize'
import db from './db/models'
import type { Post as PostType } from './types'
import path from 'path'

const env: string = process.env.NODE_ENV || 'development'
const isDev: boolean = env === 'development'
const isProd: boolean = env === 'production'

const router = express.Router()

/**
 * ==============================================
 * API Implementation
 * ==============================================
 */
router.get('/posts', async (req: Request, res: Response<Model<PostType>[]>) => {
  // @ts-ignore
  const posts = await db.post.findAll<Model<PostType>>({
    order: [['id', 'DESC']],
  })

  res.json(posts)
})

router.get('/post/:id', async (req: Request, res: Response) => {
  // @ts-ignore
  const post = await db.post.findOne({
    where: { id: req.params.id },
  })

  res.json(post)
})

router.delete('/post/:id', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    await db.post.destroy({ where: { id: req.params.id } })
    res.send(200)
  } catch (error) {
    res.send(500)
  }
})

router.post('/signup', async (req: Request, res: Response) => {
  const body = req.body
  if (!(body?.name && body?.password)) {
    return res.status(400).json({ error: 'Data not formatted properly' })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(body.password, salt)

  try {
    // @ts-ignore
    const author = await db.author.create({
      name: body.name,
      password: hash,
    })

    res.status(201).json({ author })
  } catch (error) {
    res.send(500)
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const body = req.body
  // @ts-ignore
  const author = await db.author.findOne({
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

router.post('/create', async (req: Request, res: Response) => {
  const body = req.body
  try {
    // @ts-ignore
    const newPost = await db.post.create({
      title: body.title,
      body: body.body,
    })

    res.status(201).send(newPost)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    res.send(500)
  }
})

router.post('/update', async (req: Request, res: Response) => {
  const body = req.body
  try {
    // @ts-ignore
    await db.update(
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
 * Express Setup
 * ==============================================
 */
const app = express()
// @ts-ignore
app.use(bodyParser.json())
app.use(cors())
app.use(compression())
app.use('/api', router)

/**
 * ==============================================
 * DEV Server
 * ==============================================
 */
if (isDev) {
  app.listen(4000, () => {
    // eslint-disable-next-line no-console
    console.log(`DEV Api Server listening on port 4000!`)
  })
}

/**
 * ==============================================
 * Prod Server
 * ==============================================
 */
if (isProd) {
  app.use('/', express.static(path.join(__dirname, '../build')))

  // Handle DirectLink
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
  })

  const privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/digitalstrength.dev/privkey.pem',
    'utf-8'
  )
  const certificate = fs.readFileSync(
    '/etc/letsencrypt/live/digitalstrength.dev/cert.pem',
    'utf-8'
  )
  const ca = fs.readFileSync(
    '/etc/letsencrypt/live/digitalstrength.dev/chain.pem',
    'utf-8'
  )

  const ProdServer = https.createServer(
    { key: privateKey, cert: certificate, ca: ca },
    app
  )

  ProdServer.listen(443, () => {
    // eslint-disable-next-line no-console
    console.log('ProdServer listening on port 443!')
  })
}
