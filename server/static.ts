import path from 'path'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
// @ts-ignore
app.use(bodyParser())
app.use(cors())

app.use('/', express.static(path.join(__dirname, '../../build')))

const staticServer = http.createServer(app)

staticServer.listen(4328, () => {
  // eslint-disable-next-line no-console
  console.log('Static Server running on port 4328')
})
