import app from './app'
import DB from './DB/sequelize'

async function connect() {
  try {
    await DB.authenticate()
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error)
  }
}
connect()

DB.sync({ force: true })
  // eslint-disable-next-line no-console
  .then((res) => console.log(res))
  // eslint-disable-next-line no-console
  .catch((res) => console.log(res))

const port = 4000 || process.env.port

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API Server listening on port ${port}!`)
})
