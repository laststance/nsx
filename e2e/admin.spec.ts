import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'

import { test } from './helper'

const exec = util.promisify(execCb)

test.beforeAll(async () => {
  await exec('pnpm db:reset')
})

test.describe('login & logout', () => {
  test('show login button', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.keyboard.press('x')
    await expect(page.getByTestId('login-link')).toBeVisible()
  })

  test('failed login with incorrect user/password', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.keyboard.press('x')
    await page.click('[data-testid=login-link]')
    await page.fill('[data-testid=name-input]', 'wefjweiofjwie')
    await page.fill('[data-testid=password-input]', 'wfjweoifjio23r03')
    await page.click('[data-testid=submit-btn]')
    await expect(page.getByTestId('snackbar')).toHaveText('User does not exist')
  })

  test('successful Logout', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3000')
    await page.keyboard.press('x')
    await page.click('[data-testid=logout-link]')
    await expect(page).toHaveURL('http://localhost:3000/')
    await expect(page.getByTestId('login-link')).toBeVisible()
  })
})

test.describe('CRUD post operation', () => {
  test('create new post via Sidebar', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3000')
    await page.click('header > div > a:has-text("NSX")')
    await page.keyboard.press('x')
    await page.getByTestId('create-link').click()
    await expect(page).toHaveURL('http://localhost:3000/dashboard/create')
    await page.getByTestId('post-title-input').fill('from platwright')
    await page.getByTestId('post-body-input').fill('testing now')

    await page.getByTestId('submit-btn').click()

    await expect(page.getByTestId('snackbar')).toHaveText('New Post Created!')

    await expect(page.locator('main h1')).toContainText('from platwright')
    await expect(page.locator('main article')).toContainText('testing now')
    await expect(page.locator('[data-testid=edit-btn]')).toBeVisible()
  })

  test('create new post via Dashboard', async ({ authenticated: page }) => {
    await page.click('header > div > a:has-text("NSX")')
    await page.keyboard.press('x')
    await page.getByTestId('create-link').click()
    await expect(page).toHaveURL('http://localhost:3000/dashboard/create')
    await page.getByTestId('post-title-input').fill('from platwright dash')
    await page.getByTestId('post-body-input').fill('testing now dash')

    await page.getByTestId('submit-btn').click()

    await expect(page.getByTestId('snackbar').nth(1)).toHaveText(
      'New Post Created!',
    )

    await expect(page.locator('main h1')).toContainText('from platwright dash')
    await expect(page.locator('main article')).toContainText('testing now dash')
    await expect(page.locator('[data-testid=edit-btn]')).toBeVisible()
  })

  test('edit existing post', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3000/')
    await expect(page.getByTestId('single-post-page-link-1')).toHaveText(
      'from platwright dash',
    )
    await page.getByTestId('single-post-page-link-1').click()
    await expect(page).toHaveURL('http://localhost:3000/post/61')
    await expect(page.locator('main h1')).toContainText('from platwright dash')
    await expect(page.locator('main article')).toContainText('testing now dash')
    await page.locator('[data-testid=edit-btn]').click()
    await page.getByTestId('edit-title-input').fill('Edit Title!')
    await page.getByTestId('edit-body-input').fill('Edit Post Contents!')

    await page.getByTestId('update-btn').click()
    await expect(page).toHaveURL('http://localhost:3000/post/61')
    await expect(page.locator('main h1')).toContainText('Edit Title!')
    await expect(page.locator('main article')).toContainText(
      'Edit Post Contents!',
    )
  })

  test('delete post', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3000/')
    await page.keyboard.press('x')
    await page.getByTestId('dashboard-link').click()
    await expect(page).toHaveURL('http://localhost:3000/dashboard')
    await expect(page.locator('main')).toHaveText(/Edit Title!/)
    await page.getByTestId('delete-btn-1').click()
    await expect(page).toHaveURL('http://localhost:3000/dashboard')
    await expect(page.getByTestId('snackbar')).toHaveText('Delete Successful!')
    await expect(page.locator('main')).not.toHaveText(/Edit Title!/)
  })
})

test.describe('Tweet CRUD', () => {
  // TODO: add tweet CRUD test
  test('create new tweet', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3000/')
    await page.keyboard.press('x')
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

  test('delete tweet', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3000/')
    await page.keyboard.press('x')
    await page.click('[data-testid="tweet-link"]')
    await expect(page).toHaveURL('http://localhost:3000/dashboard/tweet')

    // Wait for the page to load
    await expect(page.locator('h2')).toContainText('Tweets')

    // Wait for tweets to load
    const tweetCards = page.locator('[data-testid^="tweet-card-"]')

    // Get the initial number of tweets (ensure we have at least one tweet)
    const initialTweetCount = await tweetCards.count()
    await expect(tweetCards).toHaveCount(initialTweetCount)

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

    // Verify the tweet count decreased
    await expect(tweetCards).toHaveCount(initialTweetCount - 1)
  })
})

test.afterAll(async () => {
  await exec('pnpm db:reset')
})
