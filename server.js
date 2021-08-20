const fs = require('fs')
const https = require('https')
const path = require('path')

const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')

const db = require('./db/models')

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isProd = env === 'production'
require('dotenv').config(isProd ? path.join(__dirname, './../.env') : __dirname)
const router = express.Router()

/**
 * ==============================================
 * API Implementation
 * ==============================================
 */
router.get('/posts', async (req, res) => {
  const posts = await db.post.findAll({
    order: [['id', 'DESC']],
  })
  res.json(posts)
})

router.get('/post/:id', async (req, res) => {
  const post = await db.post.findOne({
    where: { id: req.params.id },
  })

  res.json(post)
})

router.delete('/post/:id', async (req, res) => {
  try {
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
    const author = await db.author.create({
      name: body.name,
      password: hash,
    })
    const token = jwt.sign(author.password, process.env.JWT_SECRET)
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd ? true : false,
      maxAge: 1000 * 60 * 24 * 365, // 1 year cookie
    })
    res.status(201).json(author)
  } catch (error) {
    res.send(500)
  }
})

router.post('/login', async (req, res) => {
  const body = req.body
  const author = await db.author.findOne({
    where: { name: body.name },
  })
  if (author) {
    const validPassword = await bcrypt.compare(body.password, author.password)

    if (validPassword) {
      const token = jwt.sign(author.password, process.env.JWT_SECRET)
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd ? true : false,
        maxAge: 1000 * 60 * 24 * 365, // 1 year cookie
      })
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

router.post('/update', async (req, res) => {
  const body = req.body
  try {
    await db.update(
      { title: body.title, body: body.body },
      { where: { id: body.postId } }
    )

    res.status(200).send('success')
  } catch (error) {
    res.send(500)
  }
})

router.post('/is_login', (req, res) => {
  const { token } = req.cookies
  try {
    if (token && req.body.author) {
      const password = jwt.verify(token, process.env.JWT_SECRET)
      if (req.body.author.password === password) {
        res.status(200).json({ login: true })
      }
    } else {
      res.status(200).json({ login: false })
    }
  } catch (error) {
    res.status(500).json(error.message)
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
