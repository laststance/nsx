const { Author, Post } = require('./sequelize')

Author.create({ name: 'ryota' })

Post.create({title: 'jack trance', body: 'take me away to the post'})
Post.create({title: 'pot of greed', body: 'next time down'})
