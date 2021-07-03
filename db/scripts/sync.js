#!/usr/bin/env node
const { DB } = require('../sequelize')

// save code snipet for db sync
DB.sync({ force: true })
  .then((res) => console.log(res))
  .catch((res) => {
    console.log(res)
    process.exit(0)
  })
