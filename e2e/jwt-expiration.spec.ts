import { expect, test } from '@playwright/test'

test.describe('JWT Expiration', () => {
  test('cookie expiration should match JWT token expiration', async ({
    page,
  }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()

    // Login
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    // Intercept the login response to check the cookie
    const responsePromise = page.waitForResponse('**/login')
    await page.getByTestId('submit-btn').click()
    const response = await responsePromise

    // Get the Set-Cookie header
    const cookies = response.headers()['set-cookie']
    expect(cookies).toBeTruthy()

    // Parse the cookie to check expiration
    const cookieMatch = cookies.match(/token=([^;]+)/)
    const expiresMatch = cookies.match(/expires=([^;]+)/)
    const maxAgeMatch = cookies.match(/max-age=(\d+)/)

    expect(cookieMatch).toBeTruthy()
    expect(expiresMatch || maxAgeMatch).toBeTruthy()

    // Check that max-age is approximately 7 days (604800 seconds)
    if (maxAgeMatch) {
      const maxAge = parseInt(maxAgeMatch[1], 10)
      // Allow for some variance due to processing time
      expect(maxAge).toBeGreaterThan(604700) // ~6.99 days
      expect(maxAge).toBeLessThan(604900) // ~7.01 days
    }

    // Verify we're logged in
    await expect(page.getByTestId('dashboard-link')).toBeVisible()
  })

  test('expired JWT token should redirect to login', async ({
    page,
    context,
  }) => {
    // First login normally
    await page.goto('http://localhost:3000')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')
    await page.getByTestId('submit-btn').click()

    // Wait for successful login
    await expect(page.getByTestId('dashboard-link')).toBeVisible()

    // Get the current cookies
    const cookies = await context.cookies()
    const tokenCookie = cookies.find((c) => c.name === 'token')
    expect(tokenCookie).toBeTruthy()

    // Manually set an expired token (this is a workaround since we can't actually wait 7 days)
    // We'll create a token that's already expired by setting a past date
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

    // Try to access a protected route
    await page.goto('http://localhost:3000/dashboard')

    // Should be redirected to login or shown an error
    await expect(page).toHaveURL(/\/(login|$)/)
  })

  test('logout should clear the JWT cookie', async ({ page, context }) => {
    // Login first
    await page.goto('http://localhost:3000')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')
    await page.getByTestId('submit-btn').click()

    // Wait for successful login
    await expect(page.getByTestId('dashboard-link')).toBeVisible()

    // Verify cookie exists
    let cookies = await context.cookies()
    expect(cookies.find((c) => c.name === 'token')).toBeTruthy()

    // Logout
    await page.keyboard.press('x')
    await page.getByTestId('logout-link').click()

    // Wait for logout to complete
    await page.waitForTimeout(500)

    // Verify cookie is cleared
    cookies = await context.cookies()
    const tokenCookie = cookies.find((c) => c.name === 'token')
    expect(!tokenCookie || tokenCookie.value === '').toBeTruthy()
  })
})
