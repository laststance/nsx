import fs from 'fs'
// @ts-ignore there is no @types/redbird
import redbird from 'redbird'

// @TODO redbird.listen('digitalstrength.dev', redbird.static('./build') , 443)
// redbird.proxy('digitalstrength.dev/api', http://localhost:4534)
// @TODO https://github.com/OptimalBits/redbird#https-example

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
