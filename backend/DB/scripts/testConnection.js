#!/usr/bin/env node

// connect to DB and sync table definition
const { DB } = require('../sequelize')
const chalk = require('chalk')

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const testConnection = async () => {
  try {
    await DB.authenticate()
    // eslint-disable-next-line no-console
    console.log(
      chalk.green.bold('Connection has been established successfully.')
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(chalk.red.bold('Unable to connect to the database:'), error)
  }
}

testConnection()
