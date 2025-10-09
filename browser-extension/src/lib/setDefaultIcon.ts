export function setDefaultIcon() {
  chrome.runtime.sendMessage({
    action: 'setIcon',
    path: '../assets/images/logo.png',
  })
}
