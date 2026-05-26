import express from 'express'
import type { RequestHandler, Router } from 'express'
import rateLimit from 'express-rate-limit'
import OpenAI from 'openai'

import { isAuthorized } from '../auth'
import Logger from '../lib/Logger'
import { translateBodySchema, type TranslateBody } from '../lib/requestSchemas'
import { validateBody } from '../lib/validateRequest'

const router: Router = express.Router()

const ONE_MINUTE_MS = 60 * 1000
const TRANSLATE_MAX_REQUESTS = 10
const isProd = process.env.NODE_ENV === 'production'
const translateLimiter: RequestHandler = isProd
  ? rateLimit({
      windowMs: ONE_MINUTE_MS,
      max: TRANSLATE_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error:
          'Too many translation requests, please try again after 1 minute.',
      },
    })
  : (_req, _res, next) => next()

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
router.post(
  '/translate',
  translateLimiter,
  isAuthorized,
  validateBody(translateBodySchema),
  async (req, res) => {
    try {
      const { text } = req.body as TranslateBody

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
      Logger.error('Translation error', { error })
      const responseBody: Res.Error = {
        error: 'Translation failed',
      }

      // Internal provider details are only exposed during local development.
      if (process.env.NODE_ENV === 'development') {
        responseBody.details = [
          {
            field: 'text',
            message: error instanceof Error ? error.message : 'Unknown error',
            code: 'TRANSLATION_ERROR',
          },
        ]
      }

      res.status(500).json(responseBody)
    }
  },
)

export default router
