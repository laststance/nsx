import util from 'node:util'

const exec = util.promisify(require('node:child_process').exec)
import { expect } from '@playwright/test'

import { test } from './helper'

test.beforeAll(async () => {
  await exec('pnpm db:reset')
})

test.describe('login & logout', () => {
  test('show login button', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.keyboard.press('x')
    // Add the code to toggle the sidebar here
    const loginLink = page.getByTestId('login-link')
    expect(await loginLink.isVisible()).toBeTruthy()
  })

  test('failed login with incorrect user/password', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.keyboard.press('x')
    await page.click('[data-testid=login-link]')
    await page.fill('[data-testid=name-input]', 'wefjweiofjwie')
    await page.fill('[data-testid=password-input]', 'wfjweoifjio23r03')
    await page.click('[data-testid=submit-btn]')
    const snackbar = page.locator('[data-testid=snackbar]')
    expect(await snackbar.innerText()).toContain('USER DOES NOT EXIST')
  })

  test('successful Logout', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3000')
    await page.keyboard.press('x')
    await page.click('[data-testid=logout-link]')
    expect(page.url()).toBe('http://localhost:3000/')
    const loginLink = page.getByTestId('login-link')
    expect(loginLink).toBeTruthy()
  })
})

test.afterAll(async () => {
  await exec('pnpm db:reset')
})
