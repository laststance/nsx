require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize')

/**
 * =========================================================================
 * Connection
 * =========================================================================
 */
const DB = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
  }
)

/**
 * =========================================================================
 * Models
 * =========================================================================
 */
const Author = DB.define('author', {
  name: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
})

const Post = DB.define('post', {
  title: {
    type: DataTypes.STRING,
  },
  body: {
    type: DataTypes.TEXT,
  },
})

module.exports = {
  DB: DB,
  Author: Author,
  Post: Post,
}
