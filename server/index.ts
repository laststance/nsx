import './env' // Must be first — populates process.env before other modules

import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'

import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'

import router from './api'
import { Cron } from './cron'
import Logger from './lib/Logger'

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isProd = env === 'production'

Cron.readList.start()

/**
 Express Setup
 */
const app = express()

// --- Security middleware ---
app.use(
  helmet({
    contentSecurityPolicy: isProd
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
          },
        }
      : false,
    hsts: isProd ? { maxAge: 31_536_000, includeSubDomains: true } : false,
  }),
)

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000
const GLOBAL_RATE_LIMIT_MAX = 100
app.use(
  rateLimit({
    windowMs: FIFTEEN_MINUTES_MS,
    max: GLOBAL_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  }),
)

const corsOrigin =
  process.env.CORS_ORIGIN || (isProd ? 'https://nsx.malloc.tokyo' : '*')
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin,
    credentials: true,
  }),
)

app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('combined'))
app.use(compression())
app.use('/api', router)
/**
 DEV Server
 */
if (isDev) {
  app.listen(4000, () => {
    Logger.log()
    Logger.info('DEV API Server listening on port 4000!')
  })
} else if (isProd) {
  /**
   Prod Server
   */
  app.use('', express.static(path.join(__dirname, './../../build')))
  app.use('/', express.static(path.join(__dirname, './../../build')))

  // Handle DirectLink
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(__dirname, './../../build/index.html'))
  })

  const sslDomain = process.env.SSL_DOMAIN || 'nsx.malloc.tokyo'
  const sslBase =
    process.env.SSL_BASE_PATH || `/etc/letsencrypt/live/${sslDomain}`
  const privateKey = fs.readFileSync(
    process.env.SSL_KEY_PATH || `${sslBase}/privkey.pem`,
    'utf-8',
  )
  const certificate = fs.readFileSync(
    process.env.SSL_CERT_PATH || `${sslBase}/cert.pem`,
    'utf-8',
  )
  const ca = fs.readFileSync(
    process.env.SSL_CA_PATH || `${sslBase}/chain.pem`,
    'utf-8',
  )

  const ProdServer = https.createServer(
    { ca: ca, cert: certificate, key: privateKey },
    app,
  )

  ProdServer.listen(443, () => {
    Logger.log()
    Logger.info('Production Server listening on port 443!')
  })

  // HTTP→HTTPS redirect server
  const HTTP_REDIRECT_PORT = 80
  http
    .createServer((_req, res) => {
      res.writeHead(301, { Location: `https://${sslDomain}${_req.url}` })
      res.end()
    })
    .listen(HTTP_REDIRECT_PORT, () => {
      Logger.info(`HTTP→HTTPS redirect listening on port ${HTTP_REDIRECT_PORT}`)
    })
} else {
  Logger.error('process.env.NODE_ENV is not defined <development|production>')
  process.exit(1)
}
