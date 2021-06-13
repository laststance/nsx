import path from 'path'
import fs from 'fs'
import https from 'https'
// import vhost from 'vhost'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import { Model } from 'sequelize'
import { Author, Post } from '../db/sequelize'
import { Post as PostType } from '../DataStructure'

const isProd: boolean = process.env.NODE_ENV === 'production'
const isDev: boolean = process.env.NODE_ENV === 'development'

const router = express.Router()

/**
 * ==============================================
 * API Implementation
 * ==============================================
 */
router.get('/posts', async (req: Request, res: Response<Model<PostType>[]>) => {
  const posts = await Post.findAll<Model<PostType>>({
    include: { model: Author, as: 'author' },
    attributes: { exclude: ['authorId'] },
    order: [['id', 'DESC']],
  })

  res.json(posts)
})

router.get('/post/:id', async (req: Request, res: Response) => {
  const post = await Post.findOne({
    where: { id: req.params.id },
    include: { model: Author, as: 'author' },
    attributes: { exclude: ['authorId'] },
  })

  res.json(post)
})

router.delete('/post/:id', async (req: Request, res: Response) => {
  try {
    await Post.destroy({ where: { id: req.params.id } })
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
    const author = await Author.create({
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

router.post('/create', async (req: Request, res: Response) => {
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

router.post('/update', async (req: Request, res: Response) => {
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

const app = express()
// @ts-ignore
app.use(bodyParser())
app.use(cors())
app.use('/api', router)

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

/**
 * ==============================================
 * Prod Server
 * ==============================================
 */
if (isProd) {
  // const staticApp = express()
  // staticApp.use(
  //   vhost(
  //     'digitalstrength.dev',
  //     express.static(path.join(__dirname, '../../build'))
  //   )
  // )

  app.use(express.static(path.join(__dirname, '../../build')))

  const staticPrivatekey = fs.readFileSync(
    '/etc/letsencrypt/live/digitalstrength.dev/privkey.pem',
    'utf8'
  )
  const staticCertificate = fs.readFileSync(
    '/etc/letsencrypt/live/digitalstrength.dev/cert.pem',
    'utf8'
  )
  const staticCa = fs.readFileSync(
    '/etc/letsencrypt/live/digitalstrength.dev/chain.pem',
    'utf8'
  )

  const HttpsServer = https.createServer(
    {
      key: staticPrivatekey,
      cert: staticCertificate,
      ca: staticCa,
    },
    app
  )

  //
  // const apiPrivateKey = fs.readFileSync(
  //   '/etc/letsencrypt/live/api.digitalstrength.dev/privkey.pem',
  //   'utf8'
  // )
  // const apiCertificate = fs.readFileSync(
  //   '/etc/letsencrypt/live/api.digitalstrength.dev/cert.pem',
  //   'utf8'
  // )
  // const apiCa = fs.readFileSync(
  //   '/etc/letsencrypt/live/api.digitalstrength.dev/chain.pem',
  //   'utf8'
  // )

  // const ApiServer = https.createServer(
  //   {
  //     key: apiPrivateKey,
  //     cert: apiCertificate,
  //     ca: apiCa,
  //   },
  //   app
  // )

  HttpsServer.listen(443, () => {
    // eslint-disable-next-line no-console
    console.log('StaticServer running on port 443')
  })
}
