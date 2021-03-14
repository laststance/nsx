import { Sequelize } from 'sequelize'

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('wordpress', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
})

try {
  await sequelize.authenticate()
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}
