#!/usr/bin/env node
const { Sequelize, DataTypes } = require('sequelize')

/**
 * =========================================================================
 * Connection
 * =========================================================================
 */
const DB = new Sequelize('digital', 'strength', 'password', {
  dialect: 'mysql',
})

/**
 * =========================================================================
 * Models
 * =========================================================================
 */
const Author = DB.define('author', {
  name: {
    type: DataTypes.STRING,
    password: DataTypes.STRING,
  },
})

const Post = DB.define('post', {
  title: {
    type: DataTypes.STRING,
  },
  body: {
    type: DataTypes.STRING,
  },
})

Author.hasMany(Post)
Post.belongsTo(Author, { as: 'author' })

module.exports = {
  DB: DB,
  Author: Author,
  Post: Post,
}
