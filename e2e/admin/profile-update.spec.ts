import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'

import { test } from '../helper'

const exec = util.promisify(execCb)

test.beforeEach(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})

test.describe('Profile Update', () => {
  test('should update user name successfully', async ({ page }) => {
    // Login
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

    // Navigate to Settings -> My Account
    await page.goto('http://localhost:3010/dashboard/settings/my-account')
    await page.waitForLoadState('networkidle')

    // Verify current name is loaded
    const nameInput = page.getByTestId('name-input')
    await expect(nameInput).toHaveValue('John Doe')

    // Update name only (leave password blank)
    await nameInput.fill('Jane Smith')
    await page.getByTestId('password-input').fill('')

    // Submit update
    const updateResponsePromise = page.waitForResponse('**/profile')
    await page.getByTestId('submit-btn').click()
    const updateResponse = await updateResponsePromise

    // Verify response
    expect(updateResponse.status()).toBe(200)
    const updateData = await updateResponse.json()
    expect(updateData.name).toBe('Jane Smith')

    // Verify success message appears
    await expect(
      page.locator('text=Profile updated successfully'),
    ).toBeVisible()

    // Verify name persists after page reload
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(nameInput).toHaveValue('Jane Smith')
  })

  test('should update password successfully and verify login with new password', async ({
    page,
  }) => {
    // Login with original credentials
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    const loginResponsePromise = page.waitForResponse('**/login')
    await page.getByTestId('submit-btn').click()
    await loginResponsePromise

    await page.waitForLoadState('networkidle')

    // Navigate to Settings -> My Account
    await page.goto('http://localhost:3010/dashboard/settings/my-account')
    await page.waitForLoadState('networkidle')

    // Update password only (leave name unchanged)
    await page.getByTestId('password-input').fill('newpassword123')

    // Submit update
    const updateResponsePromise = page.waitForResponse('**/profile')
    await page.getByTestId('submit-btn').click()
    const updateResponse = await updateResponsePromise

    // Verify response
    expect(updateResponse.status()).toBe(200)

    // Verify success message appears
    await expect(
      page.locator('text=Profile updated successfully'),
    ).toBeVisible()

    // Verify password field is cleared after successful update
    await expect(page.getByTestId('password-input')).toHaveValue('')

    // Logout
    await page.keyboard.press('x')
    await page.getByTestId('logout-link').click()
    await page.waitForLoadState('networkidle')

    // Navigate to home to ensure clean state after logout
    await page.goto('http://localhost:3010')
    await page.waitForLoadState('networkidle')

    // Try login with old password (should fail)
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    const failedLoginPromise = page.waitForResponse('**/login')
    await page.getByTestId('submit-btn').click()
    const failedLoginResponse = await failedLoginPromise
    const failedBody = await failedLoginResponse.json()
    expect(failedBody.failed).toBeTruthy()

    // Login with new password (should succeed)
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('newpassword123')

    const successLoginPromise = page.waitForResponse('**/login')
    await page.getByTestId('submit-btn').click()
    const successLoginResponse = await successLoginPromise
    const successBody = await successLoginResponse.json()

    expect(successBody.failed).toBeUndefined()
    expect(successBody.name).toBe('John Doe')

    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('http://localhost:3010/dashboard')
  })

  test('should update both name and password successfully', async ({
    page,
  }) => {
    // Login
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    await page.getByTestId('submit-btn').click()
    await page.waitForLoadState('networkidle')

    // Navigate to Settings -> My Account
    await page.goto('http://localhost:3010/dashboard/settings/my-account')
    await page.waitForLoadState('networkidle')

    // Update both name and password
    await page.getByTestId('name-input').fill('Alice Johnson')
    await page.getByTestId('password-input').fill('securenewpass456')

    // Submit update
    const updateResponsePromise = page.waitForResponse('**/profile')
    await page.getByTestId('submit-btn').click()
    const updateResponse = await updateResponsePromise

    // Verify response
    expect(updateResponse.status()).toBe(200)
    const updateData = await updateResponse.json()
    expect(updateData.name).toBe('Alice Johnson')

    // Verify success message appears
    await expect(
      page.locator('text=Profile updated successfully'),
    ).toBeVisible()

    // Logout
    await page.keyboard.press('x')
    await page.getByTestId('logout-link').click()
    await page.waitForLoadState('networkidle')

    // Navigate to home to ensure clean state after logout
    await page.goto('http://localhost:3010')
    await page.waitForLoadState('networkidle')

    // Login with new credentials
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('Alice Johnson')
    await page.getByTestId('password-input').fill('securenewpass456')

    const loginResponsePromise = page.waitForResponse('**/login')
    await page.getByTestId('submit-btn').click()
    const loginResponse = await loginResponsePromise
    const loginBody = await loginResponse.json()

    expect(loginBody.failed).toBeUndefined()
    expect(loginBody.name).toBe('Alice Johnson')

    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('http://localhost:3010/dashboard')
  })

  test('should show message when no changes are made', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    await page.getByTestId('submit-btn').click()
    await page.waitForLoadState('networkidle')

    // Navigate to Settings -> My Account
    await page.goto('http://localhost:3010/dashboard/settings/my-account')
    await page.waitForLoadState('networkidle')

    // Submit without changes
    await page.getByTestId('password-input').fill('')
    await page.getByTestId('submit-btn').click()

    // Verify "No changes to save" message appears
    await expect(page.locator('text=No changes to save')).toBeVisible()
  })

  test('should validate name and password requirements', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3010')
    await page.keyboard.press('x')
    await page.getByTestId('login-link').click()
    await page.getByTestId('name-input').fill('John Doe')
    await page.getByTestId('password-input').fill('popcoon')

    await page.getByTestId('submit-btn').click()
    await page.waitForLoadState('networkidle')

    // Navigate to Settings -> My Account
    await page.goto('http://localhost:3010/dashboard/settings/my-account')
    await page.waitForLoadState('networkidle')

    // Try invalid name (too short)
    await page.getByTestId('name-input').fill('ABC')
    await page.getByTestId('submit-btn').click()

    // Verify validation error appears
    await expect(
      page.locator('text=/name should be 3~100 characters/'),
    ).toBeVisible()

    // Fix name, try invalid password (too short)
    await page.getByTestId('name-input').fill('Valid Name')
    await page.getByTestId('password-input').fill('short')
    await page.getByTestId('submit-btn').click()

    // Verify validation error appears
    await expect(
      page.locator('text=/password must be at least 6 characters long/'),
    ).toBeVisible()
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
