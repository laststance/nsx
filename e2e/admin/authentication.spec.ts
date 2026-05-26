import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'
import jwt from 'jsonwebtoken'

import { test } from '../helper'

const exec = util.promisify(execCb)
const API_BASE_URL = 'http://localhost:4000/api'

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})

test.describe('JWT Expiration', () => {
  test('login sets a one-hour access cookie and a seven-day refresh cookie', async ({
    page,
    context,
  }) => {
    // Arrange
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

    // Act
    // Get cookies from the context after login.
    const cookies = await context.cookies()
    const tokenCookie = cookies.find((c) => c.name === 'token')
    const refreshTokenCookie = cookies.find((c) => c.name === 'refreshToken')

    // If no cookie is set, login might have failed
    if (!tokenCookie) {
      // Check if we're still on login page with error
      const currentUrl = page.url()
      throw new Error(
        `Login failed - no token cookie set. Current URL: ${currentUrl}`,
      )
    }

    // Assert
    expect(tokenCookie).toBeTruthy()
    expect(refreshTokenCookie).toBeTruthy()

    // Check that the access cookie expiration is approximately one hour from now.
    const expirationDate = new Date(tokenCookie.expires * 1000)
    const now = new Date()
    const diffInHours =
      (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    expect(diffInHours).toBeGreaterThan(0.9)
    expect(diffInHours).toBeLessThan(1.1)

    const refreshExpirationDate = new Date(refreshTokenCookie!.expires * 1000)
    const refreshDiffInDays =
      (refreshExpirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

    expect(refreshDiffInDays).toBeGreaterThan(6.9)
    expect(refreshDiffInDays).toBeLessThan(7.1)

    // Verify we're logged in - check for menu button first
    await page.keyboard.press('x')
    await expect(page.getByTestId('dashboard-link')).toBeVisible()
  })

  test('expired access cookie rotates through a valid refresh cookie', async ({
    page,
    context,
  }) => {
    // Arrange
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    const loginResponsePromise = page.waitForResponse('**/login')
    await page.getByTestId('submit-btn').click()
    const loginResponse = await loginResponsePromise

    expect(loginResponse.status()).toBe(200)

    const originalCookies = await context.cookies()
    const originalTokenCookie = originalCookies.find((c) => c.name === 'token')
    const originalRefreshCookie = originalCookies.find(
      (c) => c.name === 'refreshToken',
    )

    expect(originalTokenCookie).toBeTruthy()
    expect(originalRefreshCookie).toBeTruthy()

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
    if (!accessTokenSecret) {
      throw new Error(
        'ACCESS_TOKEN_SECRET must be set for admin refresh-rotation E2E',
      )
    }

    const expiredAccessToken = jwt.sign(
      {
        kind: 'access',
        sessionVersion: 0,
        sub: '1',
      },
      accessTokenSecret,
      { expiresIn: '-1s' },
    )

    await context.addCookies([
      {
        ...originalTokenCookie!,
        value: expiredAccessToken,
        expires: Math.floor(Date.now() / 1000) + 60 * 60,
      },
    ])

    // Act
    const validateResponse = await page
      .context()
      .request.get(`${API_BASE_URL}/validate`)
    const validateBody = await validateResponse.json()
    const rotatedCookies = await context.cookies()
    const rotatedTokenCookie = rotatedCookies.find((c) => c.name === 'token')
    const rotatedRefreshCookie = rotatedCookies.find(
      (c) => c.name === 'refreshToken',
    )

    // Assert
    expect(validateResponse.status()).toBe(200)
    expect(validateBody).toMatchObject({
      valid: true,
      user: { id: 1, name: 'John Doe' },
    })
    expect(rotatedTokenCookie?.value).not.toBe(expiredAccessToken)
    expect(rotatedRefreshCookie?.value).not.toBe(originalRefreshCookie?.value)
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
    expect(response.status()).toBe(200)
    const responseBody = await response.json()
    expect(responseBody.name).toBe('John Doe')

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
    expect(loginResponse.status()).toBe(200)
    const responseBody = await loginResponse.json()
    expect(responseBody.name).toBe('John Doe')

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

    // Verify cookies are cleared
    cookies = await context.cookies()
    const tokenCookie = cookies.find((c) => c.name === 'token')
    const refreshTokenCookie = cookies.find((c) => c.name === 'refreshToken')
    expect(!tokenCookie || tokenCookie.value === '').toBeTruthy()
    expect(!refreshTokenCookie || refreshTokenCookie.value === '').toBeTruthy()

    // Verify we're redirected to home page after logout
    await expect(page).toHaveURL('http://localhost:3010/')
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
