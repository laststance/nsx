#!/usr/bin/env node
const { DB } = require('../sequelize')

// save code snipet for db sync
DB.drop()
  // eslint-disable-next-line no-console
  .then((res) => console.log(res))
  // eslint-disable-next-line no-console
  .catch((res) => console.log(res))
