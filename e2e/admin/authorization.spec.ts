import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect, type BrowserContext } from '@playwright/test'

import { test } from '../helper'

const exec = util.promisify(execCb)
const API_BASE_URL = 'http://localhost:4000/api'

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})

/**
 * Logs a browser context in through the API so its request context stores auth cookies.
 *
 * Called by authorization tests that need two isolated users.
 *
 * @param context - Playwright browser context that owns the request cookies.
 * @param name - Seeded username to authenticate as.
 * @returns Nothing after the login response has set cookies.
 * @example await loginAs(context, 'John Doe')
 */
const loginAs = async (
  context: BrowserContext,
  name: string,
): Promise<void> => {
  const response = await context.request.post(`${API_BASE_URL}/login`, {
    data: { name, password: 'popcoon' },
  })

  expect(response.status()).toBe(200)
}

test.describe('API authorization', () => {
  test('rejects unauthenticated stock and tweet mutations', async ({
    page,
  }) => {
    // Arrange
    const validStockPayload = {
      pageTitle: 'Readable page',
      url: 'https://example.com/readable-page',
    }

    // Act
    const stockResponse = await page
      .context()
      .request.post(`${API_BASE_URL}/push_stock`, {
        data: validStockPayload,
      })
    const stockListResponse = await page
      .context()
      .request.get(`${API_BASE_URL}/stocklist`)
    const tweetDeleteResponse = await page
      .context()
      .request.delete(`${API_BASE_URL}/tweet/1`)

    // Assert
    expect(stockResponse.status()).toBe(401)
    expect(await stockResponse.json()).toEqual({ error: 'No token found' })
    expect(stockListResponse.status()).toBe(401)
    expect(await stockListResponse.json()).toEqual({ error: 'No token found' })
    expect(tweetDeleteResponse.status()).toBe(401)
    expect(await tweetDeleteResponse.json()).toEqual({
      error: 'No token found',
    })
  })

  test('prevents one user from deleting another user resources', async ({
    browser,
  }) => {
    // Arrange
    const johnContext = await browser.newContext()
    const rexContext = await browser.newContext()

    await loginAs(johnContext, 'John Doe')
    await loginAs(rexContext, 'rex')

    const stockResponse = await johnContext.request.post(
      `${API_BASE_URL}/push_stock`,
      {
        data: {
          pageTitle: 'Owned stock page',
          url: 'https://example.com/owned-stock-page',
        },
      },
    )
    expect(stockResponse.status()).toBe(201)
    const stock = (await stockResponse.json()) as Stock
    expect(stock.id).toBeDefined()

    // Act
    const postDeleteResponse = await rexContext.request.delete(
      `${API_BASE_URL}/post/1`,
    )
    const stockDeleteResponse = await rexContext.request.delete(
      `${API_BASE_URL}/stock/${stock.id}`,
    )
    const tweetDeleteResponse = await rexContext.request.delete(
      `${API_BASE_URL}/tweet/1`,
    )

    // Assert
    expect(postDeleteResponse.status()).toBe(403)
    expect(await postDeleteResponse.json()).toEqual({ error: 'Forbidden' })
    expect(stockDeleteResponse.status()).toBe(403)
    expect(await stockDeleteResponse.json()).toEqual({ error: 'Forbidden' })
    expect(tweetDeleteResponse.status()).toBe(403)
    expect(await tweetDeleteResponse.json()).toEqual({ error: 'Forbidden' })

    await johnContext.close()
    await rexContext.close()
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
