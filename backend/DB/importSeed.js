const { Post } = require('./sequelize')

Post.create(
  {
    title: 'jack trance',
    body: 'take me away to the post',
    author: { name: 'ryota' },
  },
  { include: [Post.author] }
)
Post.create(
  { title: 'pot of greed', body: 'next time down', author: { name: 'ryota' } },
  { include: [Post.author] }
)
