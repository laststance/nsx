chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'setIcon') {
    chrome.action.setIcon({ path: request.path })
  }
})

chrome.tabs.onActivated.addListener(() => {
  chrome.action.setIcon({ path: '../assets/images/logo.png' })
})
