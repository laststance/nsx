import fs from 'node:fs'
import path from 'node:path'

import { writeJson } from './writeJson'

const rootDir = path.join(__dirname, '..')
afterEach(() => {
  fs.rmSync(rootDir + '/testFile.json')
})

// Tests that the function writes a valid JSON object to a file.
it('test_write_json_with_valid_object', () => {
  const fileName = 'testFile'
  const object = { name: 'John', age: 30 }
  writeJson(fileName, object)
  const fileContent = fs.readFileSync(fileName + '.json', 'utf8')
  expect(JSON.parse(fileContent)).toEqual(object)
})

// Tests that the function writes a valid JSON array to a file.
it('test_write_json_with_valid_array', () => {
  const fileName = 'testFile'
  const array = [1, 2, 3]
  writeJson(fileName, array)
  const fileContent = fs.readFileSync(fileName + '.json', 'utf8')
  expect(JSON.parse(fileContent)).toEqual({ [fileName]: array })
})

// Tests that the function writes an empty array to a file.
it('test_write_json_with_empty_array', () => {
  const fileName = 'testFile'
  const array = []
  writeJson(fileName, array)
  const fileContent = fs.readFileSync(fileName + '.json', 'utf8')
  expect(JSON.parse(fileContent)).toEqual({ [fileName]: array })
})
