var fs = require('fs')
var os = require('os')

var faker = require('faker')

function writeJson(fileName, object) {
  if (Array.isArray(object)) {
    const obj = { [fileName]: object }
    fs.writeFileSync(
      fileName + '.json',
      JSON.stringify(obj, null, 2).replace(/\n/g, os.EOL) + os.EOL
    )
    return
  }

  RegExp.prototype.toJSON = RegExp.prototype.toString
  fs.writeFileSync(
    fileName + '.json',
    JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL
  )
}

var userList = []

for (i = 0; i <= 20; i++) {
  userList.push({
    card: faker.helpers.createCard(),
    email: faker.internet.email(),
    name: faker.name.findName(),
  })
}

writeJson('userList', userList)

process.exit(0)
