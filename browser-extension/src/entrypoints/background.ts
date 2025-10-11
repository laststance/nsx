export default defineBackground(() => {
  // Listen for messages to update extension icon
  browser.runtime.onMessage.addListener((request) => {
    if (request.action === 'setIcon') {
      browser.action.setIcon({ path: request.path });
    }
  });

  // Reset icon when tab changes
  browser.tabs.onActivated.addListener(() => {
    browser.action.setIcon({ path: '/images/logo.png' });
  });
});
