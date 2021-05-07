import { Sequelize, DataTypes } from 'sequelize'

// create DB connect setting
const DB = new Sequelize('digital', 'strength', 'password', {
  dialect: 'mysql',
})

// Model table definition
export const Author = DB.define('author', {
  name: {
    type: DataTypes.STRING,
  },
})

export const Post = DB.define('post', {
  title: {
    type: DataTypes.STRING,
  },
  body: {
    type: DataTypes.STRING,
  },
})

Post.hasMany(Author)

export default DB
