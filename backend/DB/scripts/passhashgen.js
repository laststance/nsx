#!/usr/bin/env node

const process = require('process')
const bcrypt = require('bcrypt')

async function main() {
  const rawPassword = process.argv[2]

  // // generate salt to hash password
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(rawPassword, salt)
}

main()
