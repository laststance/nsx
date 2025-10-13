/**
 * Popup UI E2E Tests
 * Tests the extension popup functionality, user interactions, and UI rendering
 */

import { test, expect } from './extension-fixture';
import {
  openPopup,
  TestPages,
  waitForBackendReady,
  verifySuccessMessage,
  verifyErrorMessage,
  getTweetButtonUrl,
  typeComment,
} from './extension-fixture';

test.describe('Extension Popup UI Tests', () => {

  test('popup renders with correct structure', async ({ context, extensionId, page }) => {
    // Verify backend is ready
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    // Navigate to a test page
    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    // Open extension popup
    const popupPage = await openPopup(context, extensionId);

    // Verify main container exists
    const appRoot = popupPage.locator('#popup');
    await expect(appRoot).toBeVisible();

    // Verify row1 section with title and checkbox
    const row1 = popupPage.locator('.row1');
    await expect(row1).toBeVisible();

    const title = popupPage.locator('.title');
    await expect(title).toBeVisible();

    const checkbox = popupPage.locator('.checkbox');
    await expect(checkbox).toBeVisible();

    // Verify row2 section with textarea and tweet button
    const row2 = popupPage.locator('.row2');
    await expect(row2).toBeVisible();

    const textarea = popupPage.locator('.comment');
    await expect(textarea).toBeVisible();

    const tweetBtn = popupPage.locator('.twitter-btn');
    await expect(tweetBtn).toBeVisible();

    const result = popupPage.locator('.result');
    await expect(result).toBeVisible();

    await popupPage.close();
  });

  test('displays current page title', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    const title = popupPage.locator('.title');
    const titleText = await title.textContent();

    // Should display the page title (Example Domain)
    expect(titleText).toContain('Example');

    await popupPage.close();
  });

  test('checkbox is initially unchecked', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    const checkbox = popupPage.locator('.checkbox');
    await expect(checkbox).not.toBeChecked();

    await popupPage.close();
  });

  test('saves page on checkbox click and shows success message', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Monitor API calls
    const apiCalls: Array<any> = [];
    popupPage.on('request', async (request) => {
      if (request.method() === 'POST' && request.url().includes('/api/')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          body: request.postDataJSON(),
        });
      }
    });

    // Click checkbox to save page
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    // Wait for success message
    const success = await verifySuccessMessage(popupPage);
    expect(success).toBe(true);

    // Verify API was called
    expect(apiCalls.length).toBeGreaterThan(0);

    // Verify request payload
    const apiCall = apiCalls[0];
    expect(apiCall.body).toHaveProperty('pageTitle');
    expect(apiCall.body).toHaveProperty('url');
    expect(apiCall.body.url).toBe(TestPages.example.url);

    await popupPage.close();
  });

  test('textarea accepts comment input', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    const textarea = popupPage.locator('.comment');
    const testComment = 'This is a test comment';

    await textarea.fill(testComment);

    const value = await textarea.inputValue();
    expect(value).toBe(testComment);

    await popupPage.close();
  });

  test('tweet button includes current page URL', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    const tweetBtnUrl = await getTweetButtonUrl(popupPage);

    // Should include Twitter intent URL
    expect(tweetBtnUrl).toContain('twitter.com/intent/tweet');

    // Should include current page URL
    expect(tweetBtnUrl).toContain(encodeURIComponent(TestPages.example.url));

    await popupPage.close();
  });

  test('tweet button includes comment in URL after typing', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    const testComment = 'Check this out!';

    // Type comment
    await typeComment(popupPage, testComment);

    // Get tweet button URL
    const tweetBtnUrl = await getTweetButtonUrl(popupPage);

    // Should include the comment (URL encoded)
    expect(tweetBtnUrl).toContain(encodeURIComponent(testComment));

    await popupPage.close();
  });

  test('success message fades in and out', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Click checkbox to trigger save
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    // Wait for success message to appear
    const successSpan = popupPage.locator('.result span:has-text("Success!")');
    await successSpan.waitFor({ state: 'visible', timeout: 3000 });

    // Verify it's visible
    await expect(successSpan).toBeVisible();

    // Wait for fade out animation (should happen after 1 second)
    await popupPage.waitForTimeout(1500);

    // Message should be gone
    await expect(successSpan).not.toBeVisible();

    await popupPage.close();
  });

  test('handles API error gracefully', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Intercept API call and return error
    await popupPage.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Click checkbox
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    // Wait for error message
    const error = await verifyErrorMessage(popupPage);
    expect(error).toBe(true);

    await popupPage.close();
  });

  test('result div is empty initially', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    const result = popupPage.locator('.result');
    const content = await result.textContent();

    expect(content?.trim()).toBe('');

    await popupPage.close();
  });

  test('works with different page titles', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    // Navigate to different page
    await page.goto(TestPages.github.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Verify new title is displayed
    const title = popupPage.locator('.title');
    const titleText = await title.textContent();

    expect(titleText).toContain('GitHub');

    await popupPage.close();
  });

});
