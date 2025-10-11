import { test as base } from '@playwright/test'
import type { Page } from '@playwright/test'

type CustomFixtures = {
  authenticated: Page
}

export const test = base.extend<CustomFixtures>({
  authenticated: async ({ page }, use) => {
    // Perform login actions
    await page.goto('http://localhost:3010')
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
