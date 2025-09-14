import { BskyAgent, RichText } from '@atproto/api'
import express from 'express'
import type { Router } from 'express'

const router: Router = express.Router()

// Initialize BlueSky agent
const agent = new BskyAgent({
  service: 'https://bsky.social',
})

// Keep track of authentication state
const authState = {
  isAuthenticated: false,
  lastAuthTime: 0,
}
const AUTH_TIMEOUT = 30 * 60 * 1000 // 30 minutes

// Helper function to ensure authentication
const ensureAuthenticated = async (): Promise<void> => {
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
router.post('/bluesky/post', async (req, res) => {
  try {
    const { text } = req.body

    if (!text || typeof text !== 'string') {
      return res
        .status(400)
        .json({ error: 'Text is required and must be a string' })
    }

    if (text.length > 300) {
      return res
        .status(400)
        .json({ error: 'Text must be 300 characters or less' })
    }

    // Ensure we're authenticated
    await ensureAuthenticated()

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
      postUri: postResult.uri,
      postCid: postResult.cid,
      message: 'Successfully posted to BlueSky',
    })
  } catch (error) {
    console.error('BlueSky post error:', error)

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
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

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
    res.status(500).json({
      error: 'Failed to check status',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router
