import type { BskyAgent } from '@atproto/api'
import express from 'express'
import type { Router } from 'express'

import { isAuthorized } from '../auth'
import Logger from '../lib/Logger'
import {
  blueskyPostBodySchema,
  type BlueskyPostBody,
} from '../lib/requestSchemas'
import { validateBody } from '../lib/validateRequest'

const router: Router = express.Router()

/** Created on first use by {@link getBlueskyClient}, then reused for every request. */
let sharedAgent: BskyAgent | undefined

/**
 * Loads the Bluesky SDK on demand and returns the shared agent.
 *
 * `@atproto/api` is ESM-only since 0.20. A static import compiles to `require()`
 * in this CJS server, and the tsx dev loader then resolves the SDK's own
 * `multiformats/cid` import with CJS conditions, which crashes the server at
 * boot (ERR_PACKAGE_PATH_NOT_EXPORTED). A dynamic `import()` stays on Node's
 * ESM loader in both tsx and the esbuild bundle.
 * Called by the `/bluesky/post` handler on every request; Node caches the module.
 *
 * @returns The shared agent plus the SDK's `RichText` class.
 * @throws When the SDK module fails to load.
 *
 * @example
 * ```ts
 * const { agent, RichText } = await getBlueskyClient()
 * ```
 */
const getBlueskyClient = async () => {
  const { BskyAgent, RichText } = await import('@atproto/api')

  sharedAgent ??= new BskyAgent({
    service: 'https://bsky.social',
  })

  return { agent: sharedAgent, RichText }
}

// Keep track of authentication state
const authState = {
  isAuthenticated: false,
  lastAuthTime: 0,
}
const AUTH_TIMEOUT = 30 * 60 * 1000 // 30 minutes

// Helper function to ensure authentication
const ensureAuthenticated = async (agent: BskyAgent): Promise<void> => {
  const now = Date.now()

  // Re-authenticate if not authenticated or session expired
  if (
    !authState.isAuthenticated ||
    now - authState.lastAuthTime > AUTH_TIMEOUT
  ) {
    if (!process.env.BLUESKY_USERNAME || !process.env.BLUESKY_PASSWORD) {
      throw new Error('BlueSky credentials not configured')
    }

    await agent.login({
      identifier: process.env.BLUESKY_USERNAME,
      password: process.env.BLUESKY_PASSWORD,
    })

    // Update auth state atomically
    authState.isAuthenticated = true
    authState.lastAuthTime = Date.now()
  }
}

// POST /api/bluesky/post
router.post(
  '/bluesky/post',
  isAuthorized,
  validateBody(blueskyPostBodySchema),
  async (req, res) => {
    try {
      const { text } = req.body as BlueskyPostBody

      const { agent, RichText } = await getBlueskyClient()

      // Ensure we're authenticated
      await ensureAuthenticated(agent)

      // Create rich text with automatic facet detection
      const richText = new RichText({ text })
      await richText.detectFacets(agent)

      // Create the post
      const postResult = await agent.post({
        text: richText.text,
        facets: richText.facets,
        createdAt: new Date().toISOString(),
      })

      res.json({
        success: true,
        uri: postResult.uri,
        cid: postResult.cid,
        message: 'Successfully posted to BlueSky',
      })
    } catch (error) {
      Logger.error('BlueSky post error', { error })

      // Reset authentication state on auth errors
      if (
        error instanceof Error &&
        (error.message.includes('authentication') ||
          error.message.includes('unauthorized') ||
          error.message.includes('invalid'))
      ) {
        authState.isAuthenticated = false
      }

      res.status(500).json({
        error: 'Failed to post to BlueSky',
      })
    }
  },
)

// GET /api/bluesky/status - Check authentication status
router.get('/bluesky/status', async (req, res) => {
  try {
    const now = Date.now()
    const sessionValid =
      authState.isAuthenticated && now - authState.lastAuthTime < AUTH_TIMEOUT

    res.json({
      authenticated: sessionValid,
      lastAuthTime:
        authState.lastAuthTime > 0
          ? new Date(authState.lastAuthTime).toISOString()
          : null,
    })
  } catch (error) {
    Logger.error('BlueSky status error', { error })
    res.status(500).json({
      error: 'Failed to check status',
    })
  }
})

export default router
