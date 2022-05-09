import type { Config } from 'sequelize'
import { DataTypes, Sequelize } from 'sequelize'

import AuthorModel from './authorModel'
import PostModel from './postModel'
const env = process.env.NODE_ENV || 'development'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config: Config = require(__dirname + './../config.json')[env] // @TODO migrate get from dotenv

const sequelize = new Sequelize(
  config.database,
  config.username,
  // @ts-ignore @TODO appierd with migrate
  config.password,
  config
)

AuthorModel.init(
  {
    name: DataTypes.STRING,
    password: DataTypes.TEXT,
  },
  {
    modelName: 'author',
    sequelize,
  }
)

PostModel.init(
  {
    body: DataTypes.TEXT,
    title: DataTypes.STRING,
  },
  {
    modelName: 'post',
    sequelize,
  }
)

interface DB {
  author: typeof AuthorModel
  post: typeof PostModel
  sequelize: Sequelize
}

// @ts-ignore sequelize design is not doing straightforward class instanciation with "new" so TS can't notice class member
const db: DB = { author: AuthorModel, post: PostModel, sequelize }

export default db
