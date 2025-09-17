import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
