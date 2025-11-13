import { z } from 'zod'

/**
 * Login User Data
 */
export const nameSchema = z
  .string()
  .trim()
  .min(4, { message: 'name should be 3~100 characters' })
  .max(99, { message: 'name should be 3~100 characters' })

export const passwordSchema = z
  .string()
  .trim()
  .min(7, { message: 'password must be at least 6 characters long' })
  .max(99, { message: 'password must be at least 6 characters long' })

export const userAccountValidator = z.object({
  name: nameSchema,
  password: passwordSchema,
})

/**
 * Profile Update Data (optional fields for partial updates)
 */
export const updateProfileValidator = z
  .object({
    name: nameSchema.optional(),
    password: passwordSchema.optional(),
  })
  .refine((data) => data.name || data.password, {
    message: 'At least one field (name or password) must be provided',
  })

/**
 * Post Data
 */
export const titleSchema = z
  .string()
  .trim()
  .min(1, { message: 'title should be 1~100 characters' })
  .max(99, { message: 'title should be 1~100 characters' })

export const bodySchema = z
  .string()
  .trim()
  .min(1, { message: 'post body is requred' })

export const createPostFormValidator = z.object({
  title: titleSchema,
  body: bodySchema,
})

export const editPostFormValidator = z.object({
  title: titleSchema,
  body: bodySchema,
})

export const tweetSchema = z.object({
  id: z.number(),
  text: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Tweet = z.infer<typeof tweetSchema>
