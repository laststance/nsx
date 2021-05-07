const { Sequelize, DataTypes } = require('sequelize')

// create DB connect setting
const DB = new Sequelize('digital', 'strength', 'password', {
  dialect: 'mysql',
})

// Model table definition
const Author = DB.define('author', {
  name: {
    type: DataTypes.STRING,
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

Post.hasMany(Author)

module.exports = {
  DB: DB,
  Author: Author,
  Post: Post
}
