import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { test, expect } from '@playwright/test'

const exec = util.promisify(execCb)

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:truncate')
})

test.describe('new install', () => {
  test('show siginup page and create user, finally showing Dashboard page', async ({
    page,
  }) => {
    await page.goto('http://localhost:3010/')
    await expect(page.getByTestId('signup-page')).toBeVisible()
    await expect(page.getByTestId('signup-page')).toHaveText(/Signup/)

    // input signup form
    await page.getByTestId('signup-name-input').fill('newTransitionBloger')
    await page.getByTestId('signup-password-input').fill('superstroingpassword')
    // sbumit
    await page.getByTestId('signup-submit-btn').click()
    // pageTransition /dashboard
    await expect(page).toHaveURL('http://localhost:3010/dashboard')
    await expect(page.locator('main h1')).toHaveText(/Dashboard/)
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
