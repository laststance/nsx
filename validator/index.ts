import type { Result } from 'superstruct'
import { define, object } from 'superstruct'

import { assertCast } from '../src/lib/assertCast'

export const name = define<Author['name']>('name', (value): Result => {
  assertCast<string>(value)
  return value.trim().length > 3 && value.trim().length < 100
    ? true
    : 'name should be 3~100 characters'
})

export const password = define<Author['password']>(
  'password',
  (value): Result => {
    assertCast<string>(value)
    return value.trim().length > 6 && value.trim().length < 100
      ? true
      : 'password must be at least 6 characters long'
  }
)

export const signupFormVallidator = object({
  name: name,
  password: password,
})

export const loginFormValidator = object({
  name: name,
  password: password,
})
