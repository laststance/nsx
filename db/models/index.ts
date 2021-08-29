import type { Config } from 'sequelize'
import { DataTypes, Sequelize } from 'sequelize'

import type { AuthorModel } from './author'
import Author from './author'
import type { PostModel } from './post'
import Post from './post'
const env = process.env.NODE_ENV || 'development'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config: Config = require(__dirname + './../config.json')[env]

const sequelize = new Sequelize(
  config.database,
  config.username,
  // @ts-expect-error missing @types/sequelize
  config.password,
  config
)

Author.init(
  {
    name: DataTypes.STRING,
    password: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'author',
  }
)

Post.init(
  {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'post',
  }
)

interface DB {
  author: AuthorModel
  post: PostModel
  sequelize: Sequelize
}

// @ts-ignore sequelize design is not doing straightforward class instanciation with "new" so TS can't notice class member
const db: DB = { sequelize, author: Author, post: Post }

export default db
