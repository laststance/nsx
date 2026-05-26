import { z } from 'zod'

const POST_TITLE_MAX_LENGTH = 400
const POST_BODY_MAX_LENGTH = 50_000
const PROFILE_NAME_MAX_LENGTH = 255
const STOCK_TITLE_MAX_LENGTH = 1_000
const STOCK_URL_MAX_LENGTH = 2_048
const TRANSLATE_TEXT_MAX_LENGTH = 5_000
const TWEET_TEXT_MAX_LENGTH = 280
const BLUESKY_TEXT_MAX_LENGTH = 300
const PASSWORD_MAX_LENGTH = 128
const PASSWORD_MIN_LENGTH = 7

/**
 * Builds a trimmed string schema for request fields that must contain text.
 *
 * Used by API request schemas to keep length and whitespace rules consistent
 * before route handlers write to Prisma or external APIs.
 *
 * @param fieldName - Human-readable field name used in validation messages.
 * @param maxLength - Maximum accepted string length.
 * @returns Zod schema that trims and validates a required string field.
 * @example requiredText('Title', 400).parse(' Hello ')
 */
const requiredText = (fieldName: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, { message: `${fieldName} is required` })
    .max(maxLength, { message: `${fieldName} is too long` })

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    message: 'Password must be at least 7 characters long',
  })
  .max(PASSWORD_MAX_LENGTH, { message: 'Password is too long' })

export const createPostBodySchema = z
  .object({
    author: z.unknown().optional(),
    body: requiredText('Body', POST_BODY_MAX_LENGTH),
    title: requiredText('Title', POST_TITLE_MAX_LENGTH),
  })
  .strict()

export const updatePostBodySchema = z
  .object({
    author: z.unknown().optional(),
    body: requiredText('Body', POST_BODY_MAX_LENGTH),
    id: z.coerce.number().int().positive(),
    title: requiredText('Title', POST_TITLE_MAX_LENGTH),
  })
  .strict()

export const signupBodySchema = z
  .object({
    name: requiredText('Name', PROFILE_NAME_MAX_LENGTH).min(4, {
      message: 'Name must be at least 4 characters long',
    }),
    password: passwordSchema,
  })
  .strict()

export const loginBodySchema = z
  .object({
    name: requiredText('Name', PROFILE_NAME_MAX_LENGTH),
    password: z.string().min(1, { message: 'Password is required' }),
  })
  .strict()

export const updateProfileBodySchema = z
  .object({
    name: requiredText('Name', PROFILE_NAME_MAX_LENGTH)
      .min(4, { message: 'Name must be at least 4 characters long' })
      .optional(),
    password: passwordSchema.optional(),
  })
  .strict()
  .refine(({ name, password }) => Boolean(name || password), {
    message: 'At least one field (name or password) must be provided',
  })

export const hoverColorPreferenceBodySchema = z
  .object({
    useLegacyHoverColors: z.boolean(),
  })
  .strict()

export const pushStockBodySchema = z
  .object({
    pageTitle: requiredText('Page title', STOCK_TITLE_MAX_LENGTH).optional(),
    title: requiredText('Title', STOCK_TITLE_MAX_LENGTH).optional(),
    url: z
      .string()
      .trim()
      .url({ message: 'URL is invalid' })
      .max(STOCK_URL_MAX_LENGTH, { message: 'URL is too long' }),
  })
  .strict()
  .refine(({ pageTitle, title }) => Boolean(pageTitle || title), {
    message: 'Title is required',
    path: ['pageTitle'],
  })

export const createTweetBodySchema = z
  .object({
    text: requiredText('Tweet text', TWEET_TEXT_MAX_LENGTH),
  })
  .strict()

export const translateBodySchema = z
  .object({
    text: requiredText('Text', TRANSLATE_TEXT_MAX_LENGTH),
  })
  .strict()

export const blueskyPostBodySchema = z
  .object({
    text: requiredText('Text', BLUESKY_TEXT_MAX_LENGTH),
  })
  .strict()

export type CreatePostBody = z.output<typeof createPostBodySchema>
export type UpdatePostBody = z.output<typeof updatePostBodySchema>
export type SignupBody = z.output<typeof signupBodySchema>
export type LoginBody = z.output<typeof loginBodySchema>
export type UpdateProfileBody = z.output<typeof updateProfileBodySchema>
export type HoverColorPreferenceBody = z.output<
  typeof hoverColorPreferenceBodySchema
>
export type PushStockBody = z.output<typeof pushStockBodySchema>
export type CreateTweetBody = z.output<typeof createTweetBodySchema>
export type TranslateBody = z.output<typeof translateBodySchema>
export type BlueskyPostBody = z.output<typeof blueskyPostBodySchema>
