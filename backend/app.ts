import Express, { Request, Response } from 'express'
import cors from 'cors'
import { Sequelize } from 'sequelize'

const app = Express()
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  // Option 2: Passing parameters separately (other dialects)
  const sequelize = new Sequelize('wordpress', 'root', 'somewordpress', {
    host: '127.0.0.1',
    dialect: 'mysql',
  })

  async function connect() {
    try {
      await sequelize.authenticate()
      console.log('Connection has been established successfully.')
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
  }

  connect()

  res.json({ msg: 'Express server is working!' })
})

export default app
