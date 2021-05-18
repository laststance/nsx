#!/usr/bin/env node
const { Post, Author } = require('../sequelize')

async function main() {
  const ryota = await Author.create({
    name: 'ryota',
    password: '$2b$10$KX/AIDa3Yh6IMGevfxEhl.yRPCgR3wXgoFO5Ni1iP2rN.2Z.MP.oW',
  })

  Post.create({
    title: 'jack trance',
    body: 'take me away to the post',
    authorId: ryota.id,
  })
  Post.create({
    title: 'pot of greed',
    body: 'next time down',
    authorId: ryota.id,
  })
}

main()
