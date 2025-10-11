import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'

import { test } from '../helper'

const exec = util.promisify(execCb)

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})

test.describe('JWT Expiration', () => {
  test('cookie expiration should match JWT token expiration', async ({
    page,
    context,
  }) => {
    // Navigate to login page
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()

    // Login
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    // Submit login and wait for response
    await page.getByTestId('submit-btn').click()

    // Wait for navigation or for login error
    await page.waitForLoadState('networkidle')

    // Get cookies from the context after login
    const cookies = await context.cookies()
    const tokenCookie = cookies.find((c) => c.name === 'token')

    // If no cookie is set, login might have failed
    if (!tokenCookie) {
      // Check if we're still on login page with error
      const currentUrl = page.url()
      throw new Error(
        `Login failed - no token cookie set. Current URL: ${currentUrl}`,
      )
    }

    expect(tokenCookie).toBeTruthy()

    // Check that cookie expiration is approximately 7 days from now
    const expirationDate = new Date(tokenCookie.expires * 1000)
    const now = new Date()
    const diffInDays =
      (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

    // Allow for some variance
    expect(diffInDays).toBeGreaterThan(6.9)
    expect(diffInDays).toBeLessThan(7.1)

    // Verify we're logged in - check for menu button first
    await page.keyboard.press('x')
    await expect(page.getByTestId('dashboard-link')).toBeVisible()
  })

  test('expired JWT token should redirect to login', async ({
    page,
    context,
  }) => {
    // First login normally
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    // Wait for login response
    const responsePromise = page.waitForResponse('**/login')
    await page.getByTestId('submit-btn').click()
    const response = await responsePromise

    // Check if login was successful
    const responseBody = await response.json()
    if (responseBody.failed) {
      throw new Error(`Login failed: ${responseBody.failed}`)
    }

    // Wait for navigation and verify login
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('x')
    await expect(page.getByTestId('dashboard-link')).toBeVisible()

    // Get the current cookies
    const cookies = await context.cookies()
    const tokenCookie = cookies.find((c) => c.name === 'token')
    expect(tokenCookie).toBeTruthy()

    // Manually set an expired token
    // Clear cookies and set an invalid/expired token
    await context.clearCookies()
    await context.addCookies([
      {
        name: 'token',
        value:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.invalid', // Expired token
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'None',
      },
    ])

    // Try to access a protected route - this should trigger a 401 response
    await page.goto('http://localhost:3010/dashboard')

    // Wait for the redirect to complete
    await page.waitForLoadState('networkidle')

    // Should be redirected to home page
    await expect(page).toHaveURL('http://localhost:3010/')
  })

  test('logout should clear the JWT cookie', async ({ page, context }) => {
    // Login first
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    // Wait for login response
    const loginResponsePromise = page.waitForResponse('**/login')
    await page.getByTestId('submit-btn').click()
    const loginResponse = await loginResponsePromise

    // Check if login was successful
    const responseBody = await loginResponse.json()
    if (responseBody.failed) {
      throw new Error(`Login failed: ${responseBody.failed}`)
    }

    // Wait for navigation and verify login
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('x')
    await expect(page.getByTestId('dashboard-link')).toBeVisible()

    // Verify cookie exists
    let cookies = await context.cookies()
    expect(cookies.find((c) => c.name === 'token')).toBeTruthy()

    // Logout
    const logoutResponsePromise = page.waitForResponse('**/logout')
    await page.getByTestId('logout-link').click()
    await logoutResponsePromise

    // Wait for logout to complete and navigation
    await page.waitForLoadState('networkidle')

    // Verify cookie is cleared
    cookies = await context.cookies()
    const tokenCookie = cookies.find((c) => c.name === 'token')
    expect(!tokenCookie || tokenCookie.value === '').toBeTruthy()

    // Verify we're redirected to home page after logout
    await expect(page).toHaveURL('http://localhost:3010/')
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
