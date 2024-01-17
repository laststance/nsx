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

test.describe('CRUD post operation', () => {
  test('create new post via Dashboard', async ({ authenticated: page }) => {
    await page.goto('http://localhost:3000')
    await page.click('header > div > a:has-text("ReadList")')
    await page.keyboard.press('x')
    await page.getByTestId('create-link').click()
    await expect(page).toHaveURL('http://localhost:3000/dashboard/create')
    await page.getByTestId('post-title-input').fill('from platwright')
    await page.getByTestId('post-body-input').fill('testing now')

    await page.getByTestId('submit-btn').click()

    await expect(page.locator('main h1')).toContainText('from platwright')
    await expect(page.locator('main article')).toContainText('testing now')
    await expect(page.locator('[data-testid=edit-btn]')).toBeVisible()
  })

  // it('create new post via Sidebar', () => {
  //   cy.login()
  //   cy.get('header > div > a').contains('ReadList').click()
  //   cy.url().should('eq', 'http://localhost:3000/')
  //   cy.toggleSidebar()
  //   cy.$('create-link').contains('Create').click()
  //   cy.url().should('eq', 'http://localhost:3000/dashboard/create')
  //   cy.logger('wrting blog post...')
  //   cy.$('post-title-input').type('from cypress')
  //   cy.$('post-body-input').type('testing now')

  //   cy.$('submit-btn').click()

  //   cy.logger('jump post page and should show input contents and edit button')
  //   cy.get('main h1').contains('from cypress')
  //   cy.get('main article').contains('testing now')
  //   cy.$('edit-btn').should('exist')
  // })

  // it('edit existing post', () => {
  //   cy.login()
  //   cy.visit('http://localhost:3000/')
  //   cy.logger('Open post that creaed prev test.')
  //   cy.$('single-post-page-link-1').contains('from cypress').click()
  //   cy.url().should('eq', 'http://localhost:3000/post/72')
  //   cy.get('main h1').contains('from cypress')
  //   cy.get('main article').contains('testing now')
  //   cy.logger('Click Edit button and modify contents.')
  //   cy.$('edit-btn').contains('Edit').click()
  //   cy.$('edit-title-input').type('Edit Title!')
  //   cy.$('edit-body-input').type('Edit Post Contents!')
  //   cy.logger(
  //     'Edit complete then click Update button, after page transition single post page.',
  //   )
  //   cy.$('update-btn').contains('Update').click()
  //   cy.url().should('eq', 'http://localhost:3000/post/72')
  //   cy.get('main h1').contains('Edit Title!')
  //   cy.get('main article').contains('Edit Post Contents!')
  // })

  // it('delete post', () => {
  //   cy.login()
  //   cy.visit('http://localhost:3000/')
  //   cy.toggleSidebar()
  //   cy.$('dashboard-link').contains('Dashboard').click()
  //   cy.url().should('eq', 'http://localhost:3000/dashboard')
  //   cy.get('main').contains('Edit Title!')
  //   cy.$('delete-btn-1').contains('Delete').click()
  //   cy.url().should('eq', 'http://localhost:3000/dashboard')
  //   cy.get('main').should('not.contain', 'Edit Title!')
  // })
})

test.afterAll(async () => {
  await exec('pnpm db:reset')
})
