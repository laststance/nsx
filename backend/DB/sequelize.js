import { Sequelize } from 'sequelize'

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('digital', 'root', 'rootpass', {
  host: 'localhost',
  dialect: 'mysql',
})

try {
  await sequelize.authenticate()
  // eslint-disable-next-line no-console
  console.log('Connection has been established successfully.')
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Unable to connect to the database:', error)
}
