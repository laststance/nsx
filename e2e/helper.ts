// eslint-disable-next-line import/named
import { test as base } from '@playwright/test'

export const test = base.extend({
  authenticated: async ({ page }, use) => {
    // Perform login actions
    await page.goto('http://localhost:3000')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')
    await page.getByTestId('submit-btn').click()

    // Pass the logged in page to the test
    // eslint-disable-next-line
    await use(page)
  },
})
