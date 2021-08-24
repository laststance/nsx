import fs from 'fs'
import https from 'https'
import path from 'path'

import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'

import db from './db/models'

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isProd = env === 'production'
// .env file placed different path between dev and production.
// dev: projectRoot/.env production: projectRoot/server_build/.env
require('dotenv').config(isProd ? path.join(__dirname, './../.env') : __dirname) // eslint-disable-line @typescript-eslint/no-var-requires

const cookieOptions = {
  httpOnly: true,
  secure: true,
  //@TODO shoud added sameSite: Lax;
  maxAge: 1000 * 60 * 24 * 365, // 1 year cookie
}

const router = express.Router()

/**
 * ==============================================
 * API Implementation
 * ==============================================
 */
router.get('/posts', async (req, res) => {
  // @ts-ignore @TODO sequelize TypeScript migration will get to work next season
  const posts = await db.post.findAll({
    order: [['id', 'DESC']],
  })
  res.json(posts)
})

router.get('/post/:id', async (req, res) => {
  // @TODO verify the request from certainly admin accont
  // @ts-ignore @TODO sequelize TypeScript migration will get to work next season
  const post = await db.post.findOne({
    where: { id: req.params.id },
  })

  res.json(post)
})

router.delete('/post/:id', async (req, res) => {
  try {
    // @ts-ignore @TODO sequelize TypeScript migration will get to work next season
    await db.post.destroy({ where: { id: req.params.id } })
    res.send(200)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/signup', async (req, res) => {
  const body = req.body
  if (!(body?.name && body?.password)) {
    return res
      .status(400)
      .json({ error: 'Empty Post Body. Might be data not formatted properly.' })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(body.password, salt)

  try {
    // @ts-ignore @TODO sequelize TypeScript migration will get to work next season
    const author = await db.author.create({
      name: body.name,
      password: hash,
    })
    const token = jwt.sign(author.password, process.env.JWT_SECRET as string)
    res.cookie('token', token, cookieOptions)
    res.status(201).json(author)
  } catch (error) {
    res.send(500)
  }
})

router.post('/login', async (req, res) => {
  const body = req.body
  // @ts-ignore @TODO sequelize TypeScript migration will get to work next season
  const author = await db.author.findOne({
    where: { name: body.name },
  })
  if (author) {
    const validPassword = await bcrypt.compare(body.password, author.password)

    if (validPassword) {
      const token = jwt.sign(author.password, process.env.JWT_SECRET as string)
      res.cookie('token', token, cookieOptions)
      res.status(200).json(author)
    } else {
      res.status(400).json({ error: 'Invalid Password' })
    }
  } else {
    res.status(401).json({ error: 'User does not exist' })
  }
})

router.post('/create', async (req, res) => {
  const body = req.body
  try {
    // @ts-ignore @TODO sequelize TypeScript migration will get to work next season
    const newPost = await db.post.create({
      title: body.title,
      body: body.body,
    })

    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/update', async (req, res, next) => {
  // @TODO verify the request from certainly admin accont
  const body = req.body
  try {
    // @ts-ignore @TODO sequelize TypeScript migration will get to work next season
    await db.post.update(
      { title: body.title, body: body.body },
      { where: { id: body.postId } }
    )

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})

router.post('/is_login', (req, res) => {
  const { token } = req.cookies

  if (token && req.body.author) {
    const password = jwt.verify(token, process.env.JWT_SECRET as string)
    if (req.body.author.password === password) {
      res.cookie('token', token, cookieOptions)
      res.status(200).json({ login: true })
    }
  } else {
    // Visitor didn't loged in previos session
    res.status(200).json({ login: false })
  }
})

/**
 * ==============================================
 * Express Setup
 * ==============================================
 */
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(morgan('combined'))
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
  app.use('', express.static(path.join(__dirname, './../build')))
  app.use('/', express.static(path.join(__dirname, './../build')))

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
