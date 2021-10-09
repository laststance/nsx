import fs from 'fs'
import https from 'https'
import path from 'path'

import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import type { CookieOptions, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'

import shallowEqualScalar, { assertIsDefined } from '../src/utils'

import db from './db/models'
import type AuthorModel from './db/models/authorModel'
import type PostModel from './db/models/postModel'
import Logger from './logger'

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isProd = env === 'production'
// .env file path resolve different between dev and production.
// dev: projectRoot/.env production: projectRoot/server_build/.env
require('dotenv').config(isProd ? path.join(__dirname, './../.env') : __dirname) // eslint-disable-line @typescript-eslint/no-var-requires

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 24 * 365, // 1 year cookie
}

const router = express.Router()

/**
 * ==============================================
 * API Implementation
 * ==============================================
 */
router.get('/posts', async (req: Request, res: Response) => {
  const posts = await db.post.findAll({
    order: [['id', 'DESC']],
  })
  res.json(posts)
})

router.get('/post/:id', async (req: Request, res: Response) => {
  const post = await db.post.findOne({
    where: { id: req.params.id },
  })

  res.json(post)
})

router.delete('/post/:id', async (req: Request, res: Response) => {
  // @TODO verify the request from certainly admin accont
  try {
    await db.post.destroy({ where: { id: req.params.id } })
    res.status(200).json({ message: 'Delete Successful!' })
    // @ TODO try decent TypeScript manner catch handling
    // @ts-ignore
  } catch (error: Error) {
    Logger.error(error)
    res.status(500).json({ message: error.message })
  }
})

router.post('/signup', async (req: Request, res: Response) => {
  const body = req.body
  if (!(body?.name && body?.password)) {
    Logger.warn('Empty Post Body. Might be data not formatted properly.')
    return res
      .status(400)
      .json({ error: 'Empty Post Body. Might be data not formatted properly.' })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(body.password, salt)

  try {
    const modelInstance = await db.author.create<AuthorModel>({
      name: body.name,
      password: hash,
    })
    const author = modelInstance.toJSON() as Author

    const token = jwt.sign(author, process.env.JWT_SECRET as string)
    res.cookie('token', token, cookieOptions)
    res.status(201).json(author)
  } catch (error) {
    Logger.error(error)
    res.send(500)
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const body = req.body
  const authorModelInstance = await db.author.findOne<AuthorModel>({
    where: { name: body.name },
  })
  if (authorModelInstance) {
    const author = authorModelInstance.toJSON() as Author
    const isValidPassword = await bcrypt.compare(body.password, author.password)

    if (isValidPassword) {
      const token = jwt.sign(author, process.env.JWT_SECRET as string)
      res.cookie('token', token, cookieOptions)
      res.status(200).json(author)
    } else {
      Logger.warn('Invalid Password')
      res.status(400).json({ error: 'Invalid Password' }) // this is bad practice in real world product. Because 'Invalid Password' imply exists user that you input at the moment.
    }
  } else {
    Logger.warn('User does not exist')
    res.status(401).json({ error: 'User does not exist' }) // this also bad practice in real world product Same reason.
  }
})

router.post(
  '/is_login',
  (req: Request<_, _, isLoginRequest>, res: Response<isLoginResponse>) => {
    const token = req.cookies.token as string

    if (token && req.body.author) {
      let author
      try {
        author = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as IndexSignature<Author>
      } catch (error) {
        res.status(200).json({ login: false })
      }
      assertIsDefined(author)
      if (shallowEqualScalar(req.body.author, author)) {
        res.cookie('token', token, cookieOptions)
        res.status(200).json({ login: true })
      }
    } else {
      // Visitor didn't loged in previos session
      res.status(200).json({ login: false })
    }
  }
)

router.get('/logout', (req: Request, res: Response<LogoutResponse>) => {
  res.cookie('token', { expires: Date.now() })
  res.status(200).json({ message: 'Logout Successful' })
})

router.post('/create', async (req, res) => {
  const { title, body } = req.body
  try {
    const postModelInstance = await db.post.create<PostModel>({
      title: title,
      body: body,
    })
    const post = postModelInstance.toJSON()
    res.status(201).json(post)
    // @ts-ignore
  } catch (error: Error) {
    Logger.error(error)
    res.status(500).json({ error: error.message })
  }
})

router.post(
  '/update',
  async (req: Request, res: Response, next: NextFunction) => {
    // @TODO verify the request from certainly admin accont
    const body = req.body
    try {
      await db.post.update(
        { title: body.title, body: body.body },
        { where: { id: body.id } }
      )

      res.status(200).json({ message: 'Post Updated!' })
    } catch (error) {
      Logger.error(error)
      next(error)
    }
  }
)

/**
 * ==============================================
 * Express Setup
 * ==============================================
 */
const app = express()
app.disable('x-powered-by')
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
    /* eslint-disable no-console */
    console.log()
    console.log(chalk.green.bold('DEV API Server listening on port 4000!'))
    /* eslint-disable no-console */
  })
} else if (isProd) {
  /**
   * ==============================================
   * Prod Server
   * ==============================================
   */
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
    /* eslint-disable no-console */
    console.log()
    console.log(chalk.green.bold('Production Server listening on port 443!'))
    /* eslint-disable no-console */
  })
} else {
  Logger.error('process.env.NODE_ENV is not defined <development|production>')
  process.exit(1)
}
