import type { Result } from 'superstruct'
import { define, object } from 'superstruct'
import { z } from 'zod'

import { assertCast } from '../lib/assertCast'

/**
 * Login User Data
 */
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
  },
)

export const userAccountValidator = object({
  name: name,
  password: password,
})

/**
 * Post Data
 */
export const title = define<Post['title']>('title', (value): Result => {
  assertCast<string>(value)
  return value.trim().length > 0 && value.trim().length < 100
    ? true
    : 'title should be 1~100 characters'
})

export const body = define<Post['body']>('body', (value): Result => {
  assertCast<string>(value)
  return value.trim().length > 0 ? true : 'post body is requred'
})

export const createPostFormValidator = object({
  title: title,
  body: body,
})

export const editPostFormValidator = object({
  title: title,
  body: body,
})

export const tweetSchema = z.object({
  id: z.number(),
  text: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Tweet = z.infer<typeof tweetSchema>
