import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/**
 * Prisma v7 configuration.
 *
 * Uses process.env.DATABASE_URL directly with a placeholder fallback
 * to allow `prisma generate` to succeed in CI environments where
 * DATABASE_URL is not set. The placeholder URL is never used for
 * actual database connections - only for schema parsing during
 * client generation.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url:
      process.env.DATABASE_URL ||
      'mysql://placeholder:placeholder@localhost:3306/placeholder',
  },
})
