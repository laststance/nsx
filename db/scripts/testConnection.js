#!/usr/bin/env node

// connect to DB and sync table definition
const { DB } = require('../sequelize')
const chalk = require('chalk')

const testConnection = async () => {
  try {
    await DB.authenticate()
    console.log(
      chalk.green.bold('Connection has been established successfully.')
    )
  } catch (error) {
    console.error(chalk.red.bold('Unable to connect to the database:'), error)
  }
}

testConnection()

process.exit(0)
