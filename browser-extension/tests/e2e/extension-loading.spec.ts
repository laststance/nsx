/**
 * Extension Loading E2E Test
 * Verifies extension loads correctly using Playwright's recommended approach
 */

import { test, expect, openPopup } from './extension-fixture';

test.describe('Extension Loading Tests', () => {
  
  test('extension loads and service worker is registered', async ({ context, extensionId }) => {
    // Service worker should be registered by the fixture
    const serviceWorkers = context.serviceWorkers();
    
    console.log(`Found ${serviceWorkers.length} service workers`);
    console.log(`Extension ID: ${extensionId}`);
    
    expect(serviceWorkers.length).toBeGreaterThan(0);
    expect(extensionId).toMatch(/^[a-z]+$/);
  });
  
  test('popup page loads successfully', async ({ context, extensionId }) => {
    const popupPage = await openPopup(context, extensionId);
    
    // Verify popup loaded
    const title = await popupPage.title();
    console.log(`Popup title: ${title}`);
    
    // Verify popup container exists
    const popupContainer = popupPage.locator('#popup');
    await expect(popupContainer).toBeVisible();
    
    await popupPage.close();
  });
  
  test('extension manifest is accessible', async ({ context, extensionId }) => {
    const manifestUrl = `chrome-extension://${extensionId}/manifest.json`;
    
    const manifestPage = await context.newPage();
    await manifestPage.goto(manifestUrl);
    
    const content = await manifestPage.textContent('body');
    expect(content).toBeTruthy();
    expect(content).toContain('"manifest_version"');
    expect(content).toContain('"name"');
    
    console.log(`Manifest accessible at: ${manifestUrl}`);
    
    await manifestPage.close();
  });
  
  test('background service worker responds', async ({ context, extensionId }) => {
    const serviceWorkers = context.serviceWorkers();
    expect(serviceWorkers.length).toBeGreaterThan(0);
    
    const sw = serviceWorkers[0];
    console.log(`Service worker URL: ${sw.url()}`);
    
    // Service worker should contain our extension ID
    expect(sw.url()).toContain(extensionId);
    expect(sw.url()).toContain('background.js');
  });
});
