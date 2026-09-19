import { describe, expect, test } from 'vitest'

import { getDisplayDomain } from '@/entrypoints/popup/utils/getDisplayDomain'

describe('getDisplayDomain', () => {
  test('shortens a page URL to its domain without the www. prefix', () => {
    // Arrange
    const currentTabUrl = 'https://www.example.com/articles/1?ref=home'

    // Act
    const displayDomain = getDisplayDomain(currentTabUrl)

    // Assert
    expect(displayDomain).toBe('example.com')
  })

  test('keeps subdomains other than www.', () => {
    // Arrange
    const currentTabUrl = 'http://docs.example.com/'

    // Act
    const displayDomain = getDisplayDomain(currentTabUrl)

    // Assert
    expect(displayDomain).toBe('docs.example.com')
  })

  test('shows no domain for a browser-internal page', () => {
    // Arrange
    const currentTabUrl = 'chrome://extensions/'

    // Act
    const displayDomain = getDisplayDomain(currentTabUrl)

    // Assert
    expect(displayDomain).toBe('')
  })

  test('shows no domain before the tab URL is known', () => {
    // Arrange
    const currentTabUrl = ''

    // Act
    const displayDomain = getDisplayDomain(currentTabUrl)

    // Assert
    expect(displayDomain).toBe('')
  })
})
