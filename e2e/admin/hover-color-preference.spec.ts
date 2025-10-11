import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'

import { test } from '../helper'

const exec = util.promisify(execCb)

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})

test.describe('Hover Color Preference Toggle', () => {
  test('should toggle hover button colors between legacy and new styles', async ({
    page,
  }) => {
    // Login first
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    const loginResponsePromise = page.waitForResponse('**/login')
    await page.getByTestId('submit-btn').click()
    const loginResponse = await loginResponsePromise

    const responseBody = await loginResponse.json()
    if (responseBody.failed) {
      throw new Error(`Login failed: ${responseBody.failed}`)
    }

    await page.waitForLoadState('networkidle')

    // Navigate to Settings page
    await page.keyboard.press('x')
    await page.getByTestId('dashboard-link').click()
    await page.waitForLoadState('networkidle')

    // Navigate to Settings -> My Account
    await page.goto('http://localhost:3010/dashboard/settings/my-account')
    await page.waitForLoadState('networkidle')

    // Verify toggle switch exists and is initially off (new colors)
    const toggle = page.getByTestId('legacy-colors-toggle')
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-checked', 'false')

    // Navigate to Tweet page to check initial colors
    await page.goto('http://localhost:3010/dashboard/tweet')
    await page.waitForLoadState('networkidle')

    // Wait for tweets to load
    await page.waitForSelector('[data-testid^="tweet-card-"]', {
      timeout: 5000,
    })

    // Get first tweet card and hover to show buttons
    const firstTweetCard = page.locator('[data-testid^="tweet-card-"]').first()
    await firstTweetCard.hover()

    // Wait for buttons to appear
    const translateButton = page
      .locator('[data-testid^="translate-tweet-"]')
      .first()
    const blueSkyButton = page.locator('[data-testid^="bluesky-post-"]').first()

    await expect(translateButton).toBeVisible()
    await expect(blueSkyButton).toBeVisible()

    // Verify new colors (orange/blue) - check for orange classes on translate button
    const translateClasses = await translateButton.getAttribute('class')
    expect(translateClasses).toContain('dark:bg-orange-500/75')
    expect(translateClasses).toContain('dark:hover:bg-orange-400/85')

    // Verify new colors (orange/blue) - check for blue classes on bluesky button
    const blueSkyClasses = await blueSkyButton.getAttribute('class')
    expect(blueSkyClasses).toContain('dark:bg-blue-500/75')
    expect(blueSkyClasses).toContain('dark:hover:bg-blue-400/85')

    // Navigate back to Settings
    await page.goto('http://localhost:3010/dashboard/settings/my-account')
    await page.waitForLoadState('networkidle')

    // Toggle to legacy colors
    const updateResponsePromise = page.waitForResponse(
      '**/hover-color-preference',
    )
    await toggle.click()
    await updateResponsePromise

    // Verify toggle is now on
    await expect(toggle).toHaveAttribute('aria-checked', 'true')

    // Navigate back to Tweet page
    await page.goto('http://localhost:3010/dashboard/tweet')
    await page.waitForLoadState('networkidle')

    // Wait for tweets to load
    await page.waitForSelector('[data-testid^="tweet-card-"]', {
      timeout: 5000,
    })

    // Hover again to show buttons
    await firstTweetCard.hover()
    await expect(translateButton).toBeVisible()
    await expect(blueSkyButton).toBeVisible()

    // Verify legacy colors (cyan/amber) - check for cyan classes on translate button
    const translateClassesLegacy = await translateButton.getAttribute('class')
    expect(translateClassesLegacy).toContain('dark:bg-cyan-600/75')
    expect(translateClassesLegacy).toContain('dark:hover:bg-cyan-500/85')

    // Verify legacy colors (cyan/amber) - check for amber classes on bluesky button
    const blueSkyClassesLegacy = await blueSkyButton.getAttribute('class')
    expect(blueSkyClassesLegacy).toContain('dark:bg-amber-600/75')
    expect(blueSkyClassesLegacy).toContain('dark:hover:bg-amber-500/85')

    // Test persistence: Reload page and verify colors remain
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Wait for tweets to load after reload
    await page.waitForSelector('[data-testid^="tweet-card-"]', {
      timeout: 5000,
    })

    // Hover again
    await firstTweetCard.hover()
    await expect(translateButton).toBeVisible()

    // Verify legacy colors persist after reload
    const translateClassesAfterReload =
      await translateButton.getAttribute('class')
    expect(translateClassesAfterReload).toContain('dark:bg-cyan-600/75')
    expect(translateClassesAfterReload).toContain('dark:hover:bg-cyan-500/85')

    // Toggle back to new colors
    await page.goto('http://localhost:3010/dashboard/settings/my-account')
    await page.waitForLoadState('networkidle')

    const updateResponsePromise2 = page.waitForResponse(
      '**/hover-color-preference',
    )
    await toggle.click()
    await updateResponsePromise2

    // Verify toggle is now off
    await expect(toggle).toHaveAttribute('aria-checked', 'false')

    // Verify colors are back to new (orange/blue)
    await page.goto('http://localhost:3010/dashboard/tweet')
    await page.waitForLoadState('networkidle')

    await page.waitForSelector('[data-testid^="tweet-card-"]', {
      timeout: 5000,
    })

    await firstTweetCard.hover()
    await expect(translateButton).toBeVisible()

    const translateClassesFinal = await translateButton.getAttribute('class')
    expect(translateClassesFinal).toContain('dark:bg-orange-500/75')
    expect(translateClassesFinal).toContain('dark:hover:bg-orange-400/85')
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
