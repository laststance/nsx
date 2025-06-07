import { expect } from '@playwright/test'

import { test } from './helper'

test.describe('Tweet functionality', () => {
  test('should create a tweet and see it in the list automatically', async ({
    authenticated: page,
  }) => {
    // Navigate to tweet page
    await page.goto('http://localhost:3000')
    await page.keyboard.press('x') // Open sidebar
    await page.click('[data-testid="tweet-link"]')
    await expect(page).toHaveURL('http://localhost:3000/dashboard/tweet')

    // Wait for the page to load
    await expect(page.locator('h2')).toContainText('Tweets')

    // Wait for tweets to load or check if there are no tweets yet
    const tweetCards = page.locator('[data-testid^="tweet-card-"]')

    // Get the initial number of tweets
    const initialTweetCount = await tweetCards.count()

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

    // Verify the tweet count increased
    await expect(tweetCards).toHaveCount(initialTweetCount + 1)

    // Verify the form was reset
    await expect(page.locator('input[name="text"]')).toHaveValue('')
  })
})
