import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'

import { test } from '../helper'

const exec = util.promisify(execCb)

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})

test.describe('Tweet CRUD', () => {
  test('create new tweet', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3010/')
    await page.keyboard.press('x')
    await page.click('[data-testid="tweet-link"]')
    await expect(page).toHaveURL('http://localhost:3010/dashboard/tweet')

    // Wait for the page to load
    await expect(page.locator('h2')).toContainText('Tweets')

    // Create a new tweet
    const testTweetText = `Test tweet ${Date.now()}`
    await page.fill('input[name="text"]', testTweetText)
    await page.click('button[type="submit"]')

    // Wait for success message using the correct snackbar test id
    await expect(page.locator('[data-testid="snackbar"]')).toContainText(
      'Tweet created successfully',
    )

    // Verify the tweet appears in the list automatically (without manual refresh)
    await expect(page.locator(`text=${testTweetText}`)).toBeVisible()

    // Verify the form was reset
    await expect(page.locator('input[name="text"]')).toHaveValue('')
  })

  test('delete tweet', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3010/')
    await page.keyboard.press('x')
    await page.click('[data-testid="tweet-link"]')
    await expect(page).toHaveURL('http://localhost:3010/dashboard/tweet')

    // Wait for the page to load
    await expect(page.locator('h2')).toContainText('Tweets')

    // Wait for tweets to load
    const tweetCards = page.locator('[data-testid^="tweet-card-"]')

    // Get the first tweet and its delete button
    const firstTweetCard = tweetCards.first()
    const deleteButton = firstTweetCard.locator(
      '[data-testid^="delete-tweet-"]',
    )

    // Click the delete button
    await deleteButton.click()

    // Wait for success message
    await expect(page.locator('[data-testid="snackbar"]')).toContainText(
      'Tweet deleted successfully',
    )
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
