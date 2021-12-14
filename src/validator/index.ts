import type { Result } from 'superstruct'
import { define, object } from 'superstruct'

import { assertCast } from '../lib/assertCast'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const name = define('name', (value, context): Result => {
  assertCast<string>(value)
  return value.length > 4 && value.length < 10 ? false : true
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const password = define('password', (value, context): Result => {
  assertCast<string>(value)
  return value.length < 2 ? false : true
})

export const signupFormVallidator = object({
  name: name,
  password: password,
})
