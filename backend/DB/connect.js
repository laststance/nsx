// connect to DB and sync table definition
const { DB } = require('./sequelize')

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const connect = async () => {
  try {
    await DB.authenticate()
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error)
  }
}

module.exports = connect
