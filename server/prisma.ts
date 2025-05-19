import { PrismaClient } from '@prisma/client'

// Recursive function to convert dates to strings
function convertDateToString(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (obj instanceof Date) {
    return obj.toISOString()
  }

  if (Array.isArray(obj)) {
    return obj.map(convertDateToString)
  }

  if (typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = convertDateToString(obj[key])
    }
  }

  return obj
}

// Instantiate the client
const originalPrisma = new PrismaClient()

// Add middleware (kept for safety)
originalPrisma.$use(async (params, next) => {
  const result = await next(params)
  return convertDateToString(result)
})

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
          if (data.createdAt instanceof Date) {
            return data.createdAt.toISOString()
          }
          return data.createdAt as string
        },
      },
      // Convert updatedAt field to string
      updatedAt: {
        needs: { updatedAt: true } as any,
        compute(data: any): string {
          if (data.updatedAt instanceof Date) {
            return data.updatedAt.toISOString()
          }
          return data.updatedAt as string
        },
      },
    },
  },
})

export { prisma }
