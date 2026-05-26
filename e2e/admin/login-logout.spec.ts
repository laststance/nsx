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
    await page.goto('http://localhost:3010/')
    await page.keyboard.press('x')
    await expect(page.getByTestId('login-link')).toBeVisible()
  })

  test('returns the same invalid credentials response for unknown users and wrong passwords', async ({
    page,
  }) => {
    // Arrange
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.click('[data-testid=login-link]')
    await page.fill('[data-testid=name-input]', 'wefjweiofjwie')
    await page.fill('[data-testid=password-input]', 'wfjweoifjio23r03')
    const unknownUserResponsePromise = page.waitForResponse('**/login')

    // Act
    await page.click('[data-testid=submit-btn]')
    const unknownUserResponse = await unknownUserResponsePromise

    // Assert
    expect(unknownUserResponse.status()).toBe(401)
    await expect(page.getByTestId('snackbar').last()).toHaveText(
      'Invalid credentials',
    )
    await expect(page).toHaveURL('http://localhost:3010/login')
    expect(await unknownUserResponse.json()).toEqual({
      error: 'Invalid credentials',
      code: 'AUTHENTICATION_FAILED',
    })

    // Arrange
    await page.fill('[data-testid=name-input]', 'John Doe')
    await page.fill('[data-testid=password-input]', 'wfjweoifjio23r03')
    const wrongPasswordResponsePromise = page.waitForResponse('**/login')

    // Act
    await page.click('[data-testid=submit-btn]')
    const wrongPasswordResponse = await wrongPasswordResponsePromise

    // Assert
    expect(wrongPasswordResponse.status()).toBe(401)
    await expect(page.getByTestId('snackbar').last()).toHaveText(
      'Invalid credentials',
    )
    await expect(page).toHaveURL('http://localhost:3010/login')
    expect(await wrongPasswordResponse.json()).toEqual({
      error: 'Invalid credentials',
      code: 'AUTHENTICATION_FAILED',
    })
  })

  test('successful Logout', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.click('[data-testid=logout-link]')
    await expect(page).toHaveURL('http://localhost:3010/')
    await expect(page.getByTestId('login-link')).toBeVisible()
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
