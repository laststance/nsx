export function setBookmarkedIcon() {
  chrome.runtime.sendMessage({
    action: 'setIcon',
    path: '../assets/images/logo-bookmarked.png',
  })
}
