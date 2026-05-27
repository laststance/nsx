import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const PLACEHOLDER_DATABASE_URL =
  'mysql://placeholder:placeholder@localhost:3306/placeholder'
const RUNTIME_SOCKET_QUERY_PARAMETER = 'socketPath'
const PRISMA_CLI_SOCKET_QUERY_PARAMETER = 'socket'

/**
 * Converts the app runtime MySQL socket URL into the Prisma CLI socket URL.
 * @param databaseUrl - DATABASE_URL read from the deploy environment.
 * @returns
 * - With socketPath: equivalent URL using Prisma's documented socket parameter
 * - Without socketPath: the original URL
 * - When missing: placeholder URL used only for schema parsing
 * @example
 * normalizeDatabaseUrlForPrismaCli('mysql://root:pass@localhost/digital?socketPath=/tmp/mysql.sock')
 * // => 'mysql://root:pass@localhost/digital?socket=%2Ftmp%2Fmysql.sock'
 */
export const normalizeDatabaseUrlForPrismaCli = (
  databaseUrl: string | undefined,
): string => {
  if (!databaseUrl) {
    return PLACEHOLDER_DATABASE_URL
  }

  try {
    const parsedDatabaseUrl = new URL(databaseUrl)
    const socketPath = parsedDatabaseUrl.searchParams.get(
      RUNTIME_SOCKET_QUERY_PARAMETER,
    )

    if (!socketPath) {
      return databaseUrl
    }

    // Prisma CLI expects `socket`, while the runtime MariaDB adapter uses `socketPath`.
    parsedDatabaseUrl.searchParams.delete(RUNTIME_SOCKET_QUERY_PARAMETER)
    parsedDatabaseUrl.searchParams.set(
      PRISMA_CLI_SOCKET_QUERY_PARAMETER,
      socketPath,
    )
    return parsedDatabaseUrl.toString()
  } catch {
    // Invalid URLs should still surface through Prisma; only translate the known key.
    return databaseUrl.replace(
      `${RUNTIME_SOCKET_QUERY_PARAMETER}=`,
      `${PRISMA_CLI_SOCKET_QUERY_PARAMETER}=`,
    )
  }
}

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
    url: normalizeDatabaseUrlForPrismaCli(process.env.DATABASE_URL),
  },
})
