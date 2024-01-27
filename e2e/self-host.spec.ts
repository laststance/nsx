import util from 'node:util'

const exec = util.promisify(require('node:child_process').exec)
import { test, expect } from '@playwright/test'

test.beforeAll(async () => {
  await exec('pnpm db:truncate')
})

test.describe('new install', () => {
  test('show siginup page and create user, finally showing Dashboard page', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/')
    await expect(page.getByTestId('signup-page')).toBeVisible()
    await expect(page.getByTestId('signup-page')).toHaveText(/Signup/)

    // input signup form
    await page.getByTestId('signup-name-input').fill('newTransitionBloger')
    await page.getByTestId('signup-password-input').fill('superstroingpassword')
    // sbumit
    await page.getByTestId('signup-submit-btn').click()
    // pageTransition /dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard')
    await expect(page.locator('main h1')).toHaveText(/Dashboard/)
  })
})

test.afterAll(async () => {
  await exec('pnpm db:reset')
})
