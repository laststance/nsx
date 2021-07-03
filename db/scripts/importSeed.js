#!/usr/bin/env node
const { Post, Author } = require('../sequelize')

async function main() {
  const ryota = await Author.create({
    name: 'ryota',
    password: '$2b$10$PDIcmRmxvgVeIaa/c9AWiu4wRQD7EwBjczFqVDjgMtsj4.To0W5aC', // hash of 'popcoon'
  })

  Post.create({
    title: 'jack trance',
    body: 'take me away to the post',
  })
  Post.create({
    title: 'pot of greed',
    body: 'next time down',
  })
}

main()
