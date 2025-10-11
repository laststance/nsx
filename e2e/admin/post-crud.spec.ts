import { exec as execCb } from 'node:child_process'
import util from 'node:util'

import { expect } from '@playwright/test'

import { test } from '../helper'

const exec = util.promisify(execCb)

test.beforeAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})

test.describe('CRUD post operation', () => {
  test('create new post via Sidebar', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3010')
    await page.click('header > div > a:has-text("NSX")')
    await page.keyboard.press('x')
    await page.getByTestId('create-link').click()
    await expect(page).toHaveURL('http://localhost:3010/dashboard/create')
    await page.getByTestId('post-title-input').fill('from platwright')
    await page.getByTestId('post-body-input').fill('testing now')

    await page.getByTestId('submit-btn').click()

    await expect(page.getByTestId('snackbar')).toHaveText('New Post Created!')

    await expect(page.locator('main h1')).toContainText('from platwright')
    await expect(page.locator('main article')).toContainText('testing now')
    await expect(page.locator('[data-testid=edit-btn]')).toBeVisible()
  })

  test('create new post via Dashboard', async ({ authenticated: page }) => {
    await page.click('header > div > a:has-text("NSX")')
    await page.keyboard.press('x')
    await page.getByTestId('create-link').click()
    await expect(page).toHaveURL('http://localhost:3010/dashboard/create')
    await page.getByTestId('post-title-input').fill('from platwright dash')
    await page.getByTestId('post-body-input').fill('testing now dash')

    await page.getByTestId('submit-btn').click()

    await expect(page.getByTestId('snackbar').nth(1)).toHaveText(
      'New Post Created!',
    )

    await expect(page.locator('main h1')).toContainText('from platwright dash')
    await expect(page.locator('main article')).toContainText('testing now dash')
    await expect(page.locator('[data-testid=edit-btn]')).toBeVisible()
  })

  test('edit existing post', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3010/')
    await expect(page.getByTestId('single-post-page-link-1')).toHaveText(
      'from platwright dash',
    )
    await page.getByTestId('single-post-page-link-1').click()
    await expect(page).toHaveURL('http://localhost:3010/post/61')
    await expect(page.locator('main h1')).toContainText('from platwright dash')
    await expect(page.locator('main article')).toContainText('testing now dash')
    await page.locator('[data-testid=edit-btn]').click()
    await page.getByTestId('edit-title-input').fill('Edit Title!')
    await page.getByTestId('edit-body-input').fill('Edit Post Contents!')

    await page.getByTestId('update-btn').click()
    await expect(page).toHaveURL('http://localhost:3010/post/61')
    await expect(page.locator('main h1')).toContainText('Edit Title!')
    await expect(page.locator('main article')).toContainText(
      'Edit Post Contents!',
    )
  })

  test('delete post', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3010/')
    await page.keyboard.press('x')
    await page.getByTestId('dashboard-link').click()
    await expect(page).toHaveURL('http://localhost:3010/dashboard')
    await expect(page.locator('main')).toHaveText(/Edit Title!/)
    await page.getByTestId('delete-btn-1').click()
    await expect(page).toHaveURL('http://localhost:3010/dashboard')
    await expect(page.getByTestId('snackbar')).toHaveText('Delete Successful!')
    await expect(page.locator('main')).not.toHaveText(/Edit Title!/)
  })
})

test.afterAll(async () => {
  await exec('PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=yes pnpm db:reset')
})
