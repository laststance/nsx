import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'

import { test } from '../helper'

const exec = util.promisify(execCb)
const API_BASE_URL = 'http://localhost:4000/api'

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})

test.describe('API request validation', () => {
  test('rejects invalid authenticated write bodies before database writes', async ({
    authenticated: page,
  }) => {
    await page.waitForLoadState('networkidle')

    // Arrange
    const invalidPostPayload = {
      title: '',
      body: 'Valid body',
    }

    // Act
    const createPostResponse = await page
      .context()
      .request.post(`${API_BASE_URL}/create`, {
        data: invalidPostPayload,
      })
    const createPostBody = (await createPostResponse.json()) as Res.Error

    // Assert
    expect(createPostResponse.status()).toBe(400)
    expect(createPostBody).toEqual({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: [
        {
          field: 'title',
          message: 'Title is required',
          code: 'too_small',
        },
      ],
    })

    // Arrange
    const invalidProfilePayload = {
      name: 'abc',
    }

    // Act
    const profileResponse = await page
      .context()
      .request.patch(`${API_BASE_URL}/profile`, {
        data: invalidProfilePayload,
      })
    const profileBody = (await profileResponse.json()) as Res.Error

    // Assert
    expect(profileResponse.status()).toBe(400)
    expect(profileBody).toEqual({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: [
        {
          field: 'name',
          message: 'Name must be at least 4 characters long',
          code: 'too_small',
        },
      ],
    })

    // Arrange
    const invalidTweetPayload = {
      text: '',
    }

    // Act
    const tweetResponse = await page
      .context()
      .request.post(`${API_BASE_URL}/tweet`, {
        data: invalidTweetPayload,
      })
    const tweetBody = (await tweetResponse.json()) as Res.Error

    // Assert
    expect(tweetResponse.status()).toBe(400)
    expect(tweetBody).toEqual({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: [
        {
          field: 'text',
          message: 'Tweet text is required',
          code: 'too_small',
        },
      ],
    })

    // Arrange
    const invalidTranslatePayload = {
      from: 'ja',
      text: 'a'.repeat(5_001),
      to: 'en',
    }

    // Act
    const translateResponse = await page
      .context()
      .request.post(`${API_BASE_URL}/translate`, {
        data: invalidTranslatePayload,
      })
    const translateBody = (await translateResponse.json()) as Res.Error

    // Assert
    expect(translateResponse.status()).toBe(400)
    expect(translateBody).toEqual({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: [
        {
          field: 'text',
          message: 'Text is too long',
          code: 'too_big',
        },
      ],
    })
  })

  test('rejects invalid integration bodies with structured details', async ({
    authenticated: page,
  }) => {
    // Arrange
    const invalidSignupPayload = {
      name: 'Valid User',
      password: 'short',
    }

    // Act
    const signupResponse = await page
      .context()
      .request.post(`${API_BASE_URL}/signup`, {
        data: invalidSignupPayload,
      })
    const signupBody = (await signupResponse.json()) as Res.Error

    // Assert
    expect(signupResponse.status()).toBe(400)
    expect(signupBody).toEqual({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: [
        {
          field: 'password',
          message: 'Password must be at least 7 characters long',
          code: 'too_small',
        },
      ],
    })

    // Arrange
    const invalidStockPayload = {
      pageTitle: 'Readable page',
      url: 'not-a-url',
    }

    // Act
    const stockResponse = await page
      .context()
      .request.post(`${API_BASE_URL}/push_stock`, {
        data: invalidStockPayload,
      })
    const stockBody = (await stockResponse.json()) as Res.Error

    // Assert
    expect(stockResponse.status()).toBe(400)
    expect(stockBody).toEqual({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: [
        {
          field: 'url',
          message: 'URL is invalid',
          code: 'invalid_format',
        },
      ],
    })
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
