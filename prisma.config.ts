import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Use process.env directly with fallback for CI environments
    // where DATABASE_URL is not available during prisma generate
    url:
      process.env.DATABASE_URL ||
      'mysql://placeholder:placeholder@localhost:3306/placeholder',
  },
})
