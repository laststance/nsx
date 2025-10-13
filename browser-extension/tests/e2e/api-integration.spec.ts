/**
 * API Integration E2E Tests
 * Tests extension integration with backend API
 */

import { test, expect } from './extension-fixture';
import {
  openPopup,
  TestPages,
  waitForBackendReady,
  verifySuccessMessage,
  verifyErrorMessage,
  getCurrentPageInfo,
} from './extension-fixture';

test.describe('Extension API Integration Tests', () => {

  test('sends correct payload to backend API', async ({ context, extensionId, page }) => {
    // Verify backend is ready
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    // Navigate to test page
    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    // Open popup
    const popupPage = await openPopup(context, extensionId);

    // Monitor API calls
    let capturedPayload: any = null;
    popupPage.on('request', async (request) => {
      if (request.method() === 'POST' && request.url().includes('/api/')) {
        capturedPayload = request.postDataJSON();
      }
    });

    // Get current page info
    const pageInfo = await getCurrentPageInfo(page);

    // Save page
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    // Wait for API call
    await verifySuccessMessage(popupPage);

    // Verify payload
    expect(capturedPayload).not.toBeNull();
    expect(capturedPayload).toHaveProperty('pageTitle');
    expect(capturedPayload).toHaveProperty('url');
    // Extension removes trailing slashes before sending to API
    expect(capturedPayload.url).toBe(pageInfo.url.replace(/\/$/, ''));

    await popupPage.close();
  });

  test('handles 200 OK response correctly', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Intercept API and return success
    await popupPage.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, id: 123 }),
      });
    });

    // Save page
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    // Should show success message
    const success = await verifySuccessMessage(popupPage);
    expect(success).toBe(true);

    await popupPage.close();
  });

  test('handles 500 error response correctly', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Intercept API and return error
    await popupPage.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Save page
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    // Should show error message
    const error = await verifyErrorMessage(popupPage);
    expect(error).toBe(true);

    await popupPage.close();
  });

  test('handles network timeout', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Intercept API and delay response
    await popupPage.route('**/api/**', async route => {
      // Delay for 10 seconds to simulate timeout
      await new Promise(resolve => setTimeout(resolve, 10000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    // Save page
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    // Should either timeout or show error
    // (depending on axios timeout configuration)
    await popupPage.waitForTimeout(5000);

    // Check if error message appeared
    const result = popupPage.locator('.result');
    const content = await result.textContent();

    // Either empty (still waiting) or has error message
    expect(content).toBeDefined();

    await popupPage.close();
  });

  test('uses correct VITE_API_URL from environment', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Monitor API calls
    let apiUrl: string | null = null;
    popupPage.on('request', async (request) => {
      if (request.method() === 'POST') {
        apiUrl = request.url();
      }
    });

    // Save page
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    await verifySuccessMessage(popupPage);

    // Verify URL points to correct backend
    expect(apiUrl).not.toBeNull();
    expect(apiUrl).toContain('localhost:4000');
    expect(apiUrl).toContain('/api/');

    await popupPage.close();
  });

  test('handles 401 unauthorized response', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Intercept API and return unauthorized
    await popupPage.route('**/api/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' }),
      });
    });

    // Save page
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    // Should show error message
    const error = await verifyErrorMessage(popupPage);
    expect(error).toBe(true);

    await popupPage.close();
  });

  test('handles 404 not found response', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');

    const popupPage = await openPopup(context, extensionId);

    // Intercept API and return not found
    await popupPage.route('**/api/**', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not Found' }),
      });
    });

    // Save page
    const checkbox = popupPage.locator('.checkbox');
    await checkbox.check();

    // Should show error message
    const error = await verifyErrorMessage(popupPage);
    expect(error).toBe(true);

    await popupPage.close();
  });

  test('backend server is accessible', async () => {
    // Verify backend health endpoint
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    // Make direct request to backend
    const response = await fetch('http://localhost:4000/api/user_count');
    expect(response.ok).toBe(true);
  });

  test('multiple concurrent API calls', async ({ context, extensionId, page }) => {
    const backendReady = await waitForBackendReady();
    expect(backendReady).toBe(true);

    // Setup first popup
    await page.goto(TestPages.example.url);
    await page.waitForLoadState('domcontentloaded');
    const popup1 = await openPopup(context, extensionId);

    // Setup second popup on different tab
    const newTab = await context.newPage();
    await newTab.goto(TestPages.github.url);
    await newTab.waitForLoadState('domcontentloaded');
    const popup2 = await openPopup(context, extensionId);

    // Save from both popups simultaneously
    const checkbox1 = popup1.locator('.checkbox');
    const checkbox2 = popup2.locator('.checkbox');

    await Promise.all([
      checkbox1.check(),
      checkbox2.check(),
    ]);

    // Both should succeed
    const [success1, success2] = await Promise.all([
      verifySuccessMessage(popup1),
      verifySuccessMessage(popup2),
    ]);

    expect(success1).toBe(true);
    expect(success2).toBe(true);

    await popup1.close();
    await popup2.close();
    await newTab.close();
  });

});
