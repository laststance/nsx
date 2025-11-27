import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

// Parse DATABASE_URL for adapter configuration
const databaseUrl = process.env.DATABASE_URL || ''
const url = new URL(databaseUrl.replace('mysql://', 'http://'))
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port, 10) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1), // Remove leading /
  connectionLimit: 5,
})

// Instantiate the client with adapter
const originalPrisma = new PrismaClient({ adapter })

// Use Prisma Extensions to add more type-safe extensions
// This is reflected in TypeScript type definitions
const prisma = originalPrisma.$extends({
  result: {
    // Apply to all models
    $allModels: {
      // Convert createdAt field to string
      createdAt: {
        needs: { createdAt: true } as any,
        compute(data: any): string {
          try {
            if (data.createdAt instanceof Date) {
              return data.createdAt.toISOString()
            }
            return data.createdAt as string
          } catch (error) {
            console.error('Error converting createdAt:', error)
            return data.createdAt as string
          }
        },
      },
      // Convert updatedAt field to string
      updatedAt: {
        needs: { updatedAt: true } as any,
        compute(data: any): string {
          try {
            if (data.updatedAt instanceof Date) {
              return data.updatedAt.toISOString()
            }
            return data.updatedAt as string
          } catch (error) {
            console.error('Error converting updatedAt:', error)
            return data.updatedAt as string
          }
        },
      },
    },
  },
})

export { prisma }
