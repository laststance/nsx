import { describe, it } from 'vitest'

/**
 * Contract placeholder for the scoped-PAT stock-write middleware.
 *
 * Exists so the regression guards for `authenticateStockRequest` (the dedicated
 * middleware introduced in PR2 / #3784) are captured in the test tree before the
 * implementation lands. Each `it.todo` names an observable behavior the middleware
 * MUST satisfy; PR2 replaces every `it.todo` with a real DB-backed assertion
 * (U5–U8 in eng-review-test-plan-20260528-104950.md). The server vitest project
 * collects this file in the Node environment (see vitest.config.ts).
 *
 * Kept import-free of the middleware itself because that symbol does not exist
 * until PR2 — adding the import now would break collection in PR1.
 */
describe('authenticateStockRequest contract (filled in by PR2 / #3784)', () => {
  // Happy path: a valid Bearer PAT authorizes a stock write without a cookie session.
  it.todo('authenticates a stock write when a valid Bearer PAT is supplied')

  // E4: the PAT branch must hydrate the same full user shape the cookie branch does.
  it.todo(
    'hydrates req.authenticatedUser with the full session-user shape for a PAT request',
  )

  // E14: revoked / expired tokens are filtered inside one atomic lookup, not in JS.
  it.todo(
    'validates the PAT in a single atomic query that excludes revoked and expired tokens',
  )

  // U8: successful PAT auth records lastUsedAt for owner visibility.
  it.todo('updates lastUsedAt after a successful PAT authentication')

  // U7: absent Authorization header leaves the existing cookie-session path untouched.
  it.todo(
    'falls back to the existing cookie session when no Authorization header is present',
  )

  // U5 (confused-deputy guard): an invalid/revoked Bearer PAT must NOT clear the owner's auth cookies.
  it.todo(
    'responds 401 without clearing auth cookies when the Bearer PAT is invalid or revoked',
  )

  // U6: a malformed Authorization header is a client error (401), never a server error (500).
  it.todo(
    'responds 401 rather than 500 when the Authorization header is malformed',
  )
})
