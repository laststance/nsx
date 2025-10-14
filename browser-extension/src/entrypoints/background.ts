type SetIconMessage = {
  action: 'setIcon'
  path: string
}

const isSetIconMessage = (value: unknown): value is SetIconMessage => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const maybeMessage = value as Partial<SetIconMessage>
  return (
    maybeMessage.action === 'setIcon' && typeof maybeMessage.path === 'string'
  )
}

export default defineBackground(() => {
  // Listen for messages to update extension icon
  browser.runtime.onMessage.addListener((request: unknown) => {
    if (isSetIconMessage(request)) {
      browser.action.setIcon({ path: request.path })
    }
  })

  // Reset icon when tab changes
  browser.tabs.onActivated.addListener(() => {
    browser.action.setIcon({ path: '/images/logo.png' })
  })
})
