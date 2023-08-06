var fs = require('node:fs')
var os = require('node:os')

const { faker } = require('@faker-js/faker')
RegExp.prototype.toJSON = RegExp.prototype.toString

function writeJson(fileName, object) {
  if (Array.isArray(object)) {
    const obj = { [fileName]: object }
    fs.writeFileSync(
      fileName + '.json',
      JSON.stringify(obj, null, 2).replace(/\n/g, os.EOL) + os.EOL,
    )
    return
  }
  fs.writeFileSync(
    fileName + '.json',
    JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL,
  )
}

var userList = []

for (let i = 0; i <= 20; i++) {
  userList.push({
    card: faker.finance.creditCardIssuer(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
  })
}

// writeJson('userList', userList)

module.exports = {
  writeJson,
}
