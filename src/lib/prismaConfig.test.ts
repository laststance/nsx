import { describe, expect, it } from 'vitest'

import { normalizeDatabaseUrlForPrismaCli } from '../../prisma.config'

describe('normalizeDatabaseUrlForPrismaCli', () => {
  it('uses Prisma socket query when the production runtime URL contains socketPath', () => {
    // Arrange
    const databaseUrl =
      'mysql://root:secret@localhost/digital?socketPath=/home/deploy/nsx/run/mysqld/mysqld.sock'

    // Act
    const normalizedDatabaseUrl = normalizeDatabaseUrlForPrismaCli(databaseUrl)

    // Assert
    expect(normalizedDatabaseUrl).toBe(
      'mysql://root:secret@localhost/digital?socket=%2Fhome%2Fdeploy%2Fnsx%2Frun%2Fmysqld%2Fmysqld.sock',
    )
  })

  it('keeps a TCP database URL unchanged when no socketPath query exists', () => {
    // Arrange
    const databaseUrl = 'mysql://root:secret@127.0.0.1:3306/digital'

    // Act
    const normalizedDatabaseUrl = normalizeDatabaseUrlForPrismaCli(databaseUrl)

    // Assert
    expect(normalizedDatabaseUrl).toBe(
      'mysql://root:secret@127.0.0.1:3306/digital',
    )
  })

  it('uses the schema-parse placeholder when DATABASE_URL is missing', () => {
    // Arrange
    const databaseUrl = undefined

    // Act
    const normalizedDatabaseUrl = normalizeDatabaseUrlForPrismaCli(databaseUrl)

    // Assert
    expect(normalizedDatabaseUrl).toBe(
      'mysql://placeholder:placeholder@localhost:3306/placeholder',
    )
  })
})
