import type { Result } from 'superstruct'
import { define, object } from 'superstruct'

import { assertCast } from '../lib/assertCast'

// @TODO add certain rules
export const name = define('name', (value): Result => {
  assertCast<string>(value)
  return value.trim().length > 1 && value.trim().length < 100
    ? true
    : 'name should be 2~100 characters'
})

// @TODO add certain rules
export const password = define('password', (value): Result => {
  assertCast<string>(value)
  if (value.trim().length < 2)
    return 'password must be at least 2 characters long'

  return true
})

export const signupFormVallidator = object({
  name: name,
  password: password,
})
