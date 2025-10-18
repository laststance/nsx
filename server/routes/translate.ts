import path from 'node:path'

import express from 'express'
import type { Router } from 'express'
import OpenAI from 'openai'

const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'
// .env file path resolve different between dev and production.
// dev: projectRoot/.env production: projectRoot/server_build/.env
require('dotenv').config({
  path: isProd
    ? path.join(__dirname, './../../../.env')
    : path.join(__dirname, '../../.env'),
})

const router: Router = express.Router()

// Lazy initialization for OpenAI client to allow server start without API key
let openaiClient: OpenAI | null = null

/**
 * Gets or creates OpenAI client instance.
 * Throws error if OPENAI_API_KEY is not configured.
 */
const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not configured')
    }
    openaiClient = new OpenAI({ apiKey })
  }
  return openaiClient
}

// Helper function to detect Japanese text
const isJapanese = (text: string): boolean => {
  // Check for Hiragana, Katakana, and Kanji characters
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)
}

// POST /api/translate
router.post('/translate', async (req, res) => {
  try {
    const { text } = req.body

    if (!text || typeof text !== 'string') {
      return res
        .status(400)
        .json({ error: 'Text is required and must be a string' })
    }

    // If text is not Japanese, return as is
    if (!isJapanese(text)) {
      return res.json({ translatedText: text, isTranslated: false })
    }

    // Translate Japanese text to English
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional translator. Translate the following Japanese text to English. Keep the tone and meaning intact. Return only the translation without any additional text or explanations.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    })

    const translatedText = completion.choices[0]?.message?.content?.trim()

    if (!translatedText) {
      throw new Error('Translation failed - no response from OpenAI')
    }

    res.json({
      translatedText,
      isTranslated: true,
      originalText: text,
    })
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({
      error: 'Translation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router
