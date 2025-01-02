import { exec as execCb } from 'node:child_process'
import util from 'node:util'

// eslint-disable-next-line import/named
import { test, expect } from '@playwright/test'

const exec = util.promisify(execCb)

test.beforeAll(async () => {
  await exec('pnpm db:reset')
})

test.describe('visitor basic', () => {
  test('show blog title', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await expect(page).toHaveURL('http://localhost:3000/')
    await expect(page.getByRole('heading')).toHaveText('ReadList')
  })

  test('show latest article in list', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await expect(page.getByRole('main')).toHaveText(/close your eyes/)
  })

  test('show single post', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.getByTestId('single-post-page-link-1').click()
    await expect(page.getByRole('main')).toHaveText(/CSS Weekly #464/)
  })

  test('never shown every admin page link button without login', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/')
    await expect(page.getByTestId('dashboard-page-link')).not.toBeVisible()
    await page.getByTestId('single-post-page-link-2').click()

    await expect(page.getByTestId('edit-btn')).not.toBeVisible()
  })

  test('show post that contains syntax hilight Markdown', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.getByTestId('next-page-btn').click()
    await page.getByTestId('single-post-page-link-2').click()
    // 07/27/21 React Rush
    await expect(page.getByRole('main')).toHaveText(/using __proto__/)
  })
})

test.describe('pagenation', () => {
  test('working pagenation correctly', async ({ page }) => {
    // showing current & total page number
    await page.goto('http://localhost:3000/')
    await expect(page.getByTestId('single-post-page-link-1')).toHaveText(
      /close your eyes/,
    )
    await expect(page.getByTestId('page-count')).toHaveText('1 / 4')

    // Next Page Button
    await page.getByTestId('next-page-btn').click()
    await expect(page.getByTestId('single-post-page-link-1')).toHaveText(
      'Satisfied todays code things',
    )
    // expect moved page 2
    await expect(page.getByTestId('page-count')).toHaveText('2 / 4')

    // working prev button
    await page.getByTestId('prev-page-btn').click()
    await expect(page.getByTestId('single-post-page-link-1')).toHaveText(
      /close your eyes/,
    )
    await expect(page.getByTestId('page-count')).toHaveText('1 / 4')

    // disabled prev button at 1st page
    await expect(page.getByTestId('page-count')).toHaveText('1 / 4')
    await expect(page.getByTestId('prev-page-btn')).toBeDisabled()

    // disabled next page at last page
    await page.getByTestId('next-page-btn').click()
    await expect(page.getByTestId('page-count')).toHaveText('2 / 4')

    await page.getByTestId('next-page-btn').click()
    await expect(page.getByTestId('page-count')).toHaveText('3 / 4')

    await page.getByTestId('next-page-btn').click()
    await expect(page.getByTestId('page-count')).toHaveText('4 / 4')

    await expect(page.getByTestId('next-page-btn')).toBeDisabled()
  })
})

test.describe('site theme', () => {
  test('Working Light Theme switching', async ({ page }) => {
    await page.goto('http://localhost:3000/')

    // Check Light Theme
    await page.getByTestId('theme-menu-button').click()
    await page.getByTestId('theme-select-option-light').click()
    await expect(page.getByTestId('root')).not.toHaveClass('dark')
    await expect(page.getByTestId('body')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    )
  })

  test('Working Dark Theme switching', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    // Check Light Theme
    await page.getByTestId('theme-menu-button').click()
    await page.getByTestId('theme-select-option-light').click()
    await expect(page.getByTestId('root')).not.toHaveClass(/dark/)
    await expect(page.getByTestId('body')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    )

    // Check Dark Theme
    await page.getByTestId('theme-menu-button').click()
    await page.getByTestId('theme-select-option-dark').click()
    await expect(page.getByTestId('root')).toHaveClass(/dark/)
    await expect(page.getByTestId('body')).toHaveCSS(
      'background-color',
      'rgb(23, 23, 23)',
    )
  })

  test.describe('security', () => {
    test('never show private routes without login', async ({ page }) => {
      await page.goto('http://localhost:3000/')

      await page.goto('http://localhost:3000/login')
      await expect(page.getByRole('main')).toHaveText(/Login/)

      await page.goto('http://localhost:3000/signup')
      await expect(page.getByRole('main')).toHaveText('404: Page Not Found')

      await page.goto('http://localhost:3000/dashboard')
      await expect(page.getByRole('main')).toHaveText('404: Page Not Found')

      await page.goto('http://localhost:3000/create')
      await expect(page.getByRole('main')).toHaveText('404: Page Not Found')

      await page.goto('http://localhost:3000/edit')
      await expect(page.getByRole('main')).toHaveText('404: Page Not Found')

      await page.goto('http://localhost:3000/delete')
      await expect(page.getByRole('main')).toHaveText('404: Page Not Found')
    })
  })
})

test.afterAll(async () => {
  await exec('pnpm db:reset')
})
