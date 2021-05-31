#!/usr/bin/env node
const { DB } = require('../sequelize')

// save code snipet for db sync
DB.drop()
  .then((res) => console.log(res))
  .catch((res) => console.log(res))
