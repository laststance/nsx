import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'

import { test } from '../helper'

const exec = util.promisify(execCb)

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
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

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
