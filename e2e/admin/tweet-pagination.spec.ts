import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'

import { test } from '../helper'

const exec = util.promisify(execCb)

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=1 pnpm db:reset')
})

test.describe('Tweet Pagination', () => {
  test('should display tweets with pagination controls', async ({
    authenticated: page,
  }) => {
    // Navigate to Tweet page
    await page.goto('http://localhost:3000/dashboard/tweet')
    await expect(page).toHaveURL('http://localhost:3000/dashboard/tweet')

    // Check if page title is correct
    await expect(page.getByRole('heading', { name: 'Tweets' })).toBeVisible()

    // Wait for tweets to load
    await page.waitForSelector('[data-testid^="tweet-card-"]')

    // Verify first page shows 10 tweets (25 total tweets, 10 per page)
    const tweetsOnFirstPage = page.locator('[data-testid^="tweet-card-"]')
    await expect(tweetsOnFirstPage).toHaveCount(10)

    // Check pagination info shows "1 / 3"
    await expect(page.getByTestId('page-count')).toHaveText('1 / 3')

    // Verify previous button is disabled on first page
    await expect(page.getByTestId('prev-page-btn')).toBeDisabled()

    // Verify next button is enabled
    await expect(page.getByTestId('next-page-btn')).toBeEnabled()
  })

  test('should navigate to next page and show correct tweets', async ({
    authenticated: page,
  }) => {
    await page.goto('http://localhost:3000/dashboard/tweet')

    // Wait for tweets to load
    await page.waitForSelector('[data-testid^="tweet-card-"]')

    // Click next page button
    await page.getByTestId('next-page-btn').click()

    // Wait for page to update
    await page.waitForTimeout(500)

    // Verify we're on page 2
    await expect(page.getByTestId('page-count')).toHaveText('2 / 3')

    // Verify second page shows 10 tweets
    const tweetsOnSecondPage = page.locator('[data-testid^="tweet-card-"]')
    await expect(tweetsOnSecondPage).toHaveCount(10)

    // Both prev and next buttons should be enabled on middle page
    await expect(page.getByTestId('prev-page-btn')).toBeEnabled()
    await expect(page.getByTestId('next-page-btn')).toBeEnabled()
  })

  test('should navigate to last page and show remaining tweets', async ({
    authenticated: page,
  }) => {
    await page.goto('http://localhost:3000/dashboard/tweet')

    // Wait for tweets to load
    await page.waitForSelector('[data-testid^="tweet-card-"]')

    // Navigate to last page (page 3)
    await page.getByTestId('next-page-btn').click()
    await page.waitForTimeout(500)
    await page.getByTestId('next-page-btn').click()
    await page.waitForTimeout(500)

    // Verify we're on page 3
    await expect(page.getByTestId('page-count')).toHaveText('3 / 3')

    // Verify third page shows remaining 5 tweets (25 total - 20 shown = 5)
    const tweetsOnThirdPage = page.locator('[data-testid^="tweet-card-"]')
    await expect(tweetsOnThirdPage).toHaveCount(5)

    // Verify previous button is enabled and next button is disabled on last page
    await expect(page.getByTestId('prev-page-btn')).toBeEnabled()
    await expect(page.getByTestId('next-page-btn')).toBeDisabled()
  })

  test('should navigate back to previous page correctly', async ({
    authenticated: page,
  }) => {
    await page.goto('http://localhost:3000/dashboard/tweet')

    // Wait for tweets to load
    await page.waitForSelector('[data-testid^="tweet-card-"]')

    // Go to page 2
    await page.getByTestId('next-page-btn').click()
    await page.waitForTimeout(500)

    // Verify we're on page 2
    await expect(page.getByTestId('page-count')).toHaveText('2 / 3')

    // Go back to page 1
    await page.getByTestId('prev-page-btn').click()
    await page.waitForTimeout(500)

    // Verify we're back on page 1
    await expect(page.getByTestId('page-count')).toHaveText('1 / 3')

    // Verify first page shows 10 tweets
    const tweetsOnFirstPage = page.locator('[data-testid^="tweet-card-"]')
    await expect(tweetsOnFirstPage).toHaveCount(10)

    // Verify buttons state
    await expect(page.getByTestId('prev-page-btn')).toBeDisabled()
    await expect(page.getByTestId('next-page-btn')).toBeEnabled()
  })

  test('should create new tweet and maintain pagination', async ({
    authenticated: page,
  }) => {
    await page.goto('http://localhost:3000/dashboard/tweet')

    // Wait for tweets to load
    await page.waitForSelector('[data-testid^="tweet-card-"]')

    // Create a new tweet
    const newTweetText = 'This is a new tweet from E2E test'
    await page.getByRole('textbox').fill(newTweetText)
    await page.getByRole('button', { name: 'Submit' }).click()

    // Wait for tweet to be created and page to update
    await page.waitForTimeout(1000)

    // Check if success message appears
    await expect(page.getByTestId('snackbar')).toHaveText(
      'Tweet created successfully',
    )

    // New tweet should appear on first page (tweets are ordered by creation time desc)
    await expect(
      page.locator('[data-testid^="tweet-card-"]').first(),
    ).toContainText(newTweetText)

    // Still should have 10 tweets on first page
    const tweetsOnFirstPage = page.locator('[data-testid^="tweet-card-"]')
    await expect(tweetsOnFirstPage).toHaveCount(10)

    // Now we have 26 tweets total (25 seed + 1 new), so we should have 3 pages still
    // But the page count might show 1 / 3 due to the way pagination calculates
    await expect(page.getByTestId('page-count')).toContainText('/ 3')
  })

  test('should delete tweet and update pagination correctly', async ({
    authenticated: page,
  }) => {
    await page.goto('http://localhost:3000/dashboard/tweet')

    // Wait for tweets to load
    await page.waitForSelector('[data-testid^="tweet-card-"]')

    // Get the first tweet's delete button
    const firstDeleteButton = page
      .locator('[data-testid^="delete-tweet-"]')
      .first()
    await firstDeleteButton.click()

    // Wait for deletion and page update
    await page.waitForTimeout(1000)

    // Check if success message appears
    await expect(page.getByTestId('snackbar')).toHaveText(
      'Tweet deleted successfully',
    )

    // Should still show 10 tweets on first page (even after deleting one)
    const tweetsAfterDeletion = page.locator('[data-testid^="tweet-card-"]')
    await expect(tweetsAfterDeletion).toHaveCount(10)
  })
})
