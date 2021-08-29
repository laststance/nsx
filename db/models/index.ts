import fs from 'fs'
import path from 'path'

import type { Config } from 'sequelize'
import { Sequelize } from 'sequelize'
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config: Config = require(__dirname + './../config.json')[env]
const db = {}

let sequelize: Sequelize
// @ts-expect-error missing @types/sequelize
if (config.use_env_variable) {
  // @ts-ignore @TODO create envval db setting code
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    // @ts-expect-error missing @types/sequelize
    config.password,
    config
  )
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
