// @ts-ignore there is no @types/redbird
const redbird = new require('redbird')({
  port: 80,

  // Specify filenames to default SSL certificates (in case SNI is not supported by the
  // user's browser)
  ssl: {
    port: 443,
    key: '/etc/letsencrypt/live/digitalstrength.dev/privkey.pem',
    cert: '/etc/letsencrypt/live/digitalstrength.dev/cert.pem',
    ca: '/etc/letsencrypt/live/digitalstrength.dev/chain.pem',
  },
})

redbird.register('digitalstrength.dev', 'http://localhost:4328', { ssl: true })

redbird.register('digitalstrength.dev/api', 'http://localhost:4534/api', {
  ssl: true,
})
