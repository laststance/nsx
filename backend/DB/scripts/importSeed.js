#!/usr/bin/env node
const { Post, Author } = require('../sequelize')

Post.create(
  {
    title: 'jack trance',
    body: 'take me away to the post',
    author: { name: 'ryota' },
  },
  { include: { model: Author, as: 'author' } }
)
Post.create(
  { title: 'pot of greed', body: 'next time down', author: { name: 'ryota' } },
  { include: { model: Author, as: 'author' } }
)
