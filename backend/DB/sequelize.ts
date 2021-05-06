import { Sequelize, DataTypes } from 'sequelize'

// Option 2: Passing parameters separately (other dialects)
const DB = new Sequelize('digital', 'strength', 'password', {
  dialect: 'mysql',
})

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

export default DB
