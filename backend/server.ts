import app from './app'
import DB from './DB/sequelize'

async function connect() {
  try {
    await DB.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
connect()

DB.sync({ force: true })
  .then((res) => console.log(res))
  .catch((res) => console.log(res))

const port = 4000 || process.env.port

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API Server listening on port ${port}!`)
})
