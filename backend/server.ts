import app from './app'
import './DB/connect'

const port = 4000 || process.env.port

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API Server listening on port ${port}!`)
})
