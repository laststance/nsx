import fs from 'fs'
// @ts-ignore there is no @types/redbird
import redbird from 'redbird'

const privatekey = fs.readFileSync(
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

redbird.register('digitalstrength.dev', 'http://localhost:4328', {
  ssl: {
    port: 443,
    key: privatekey,
    cert: certificate,
    ca: ca,
  },
})

redbird.register('digitalstrength.dev/api', 'http://localhost:4534', {
  ssl: {
    port: 443,
    key: privatekey,
    cert: certificate,
    ca: ca,
  },
})
