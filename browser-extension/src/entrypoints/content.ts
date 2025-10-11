export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    // Content script functionality can be added here
    console.log('Reading List content script loaded');
  },
});
