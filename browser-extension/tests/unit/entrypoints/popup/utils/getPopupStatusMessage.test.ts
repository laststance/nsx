import { describe, expect, test } from 'vitest'

import { getPopupStatusMessage } from '@/entrypoints/popup/utils/getPopupStatusMessage'

describe('getPopupStatusMessage', () => {
  test('reports a successful save in green', () => {
    // Arrange
    const feedbackMessage = 'Success!'

    // Act
    const statusMessage = getPopupStatusMessage(feedbackMessage, 'connected')

    // Assert
    expect(statusMessage).toEqual({
      hasOptionsLink: false,
      text: 'Success!',
      tone: 'success',
    })
  })

  test('reports an already saved page in green', () => {
    // Arrange
    const feedbackMessage = 'Already Exists'

    // Act
    const statusMessage = getPopupStatusMessage(feedbackMessage, 'connected')

    // Assert
    expect(statusMessage).toEqual({
      hasOptionsLink: false,
      text: 'Already Exists',
      tone: 'success',
    })
  })

  test('keeps Failed... readable even though the token was just rejected', () => {
    // Arrange
    const feedbackMessage = 'Failed...'

    // Act
    const statusMessage = getPopupStatusMessage(feedbackMessage, 'rejected')

    // Assert
    expect(statusMessage).toEqual({
      hasOptionsLink: false,
      text: 'Failed...',
      tone: 'error',
    })
  })

  test('links to Options when no token is stored', () => {
    // Arrange
    const connectionStatus = 'disconnected'

    // Act
    const statusMessage = getPopupStatusMessage('', connectionStatus)

    // Assert
    expect(statusMessage).toEqual({
      hasOptionsLink: true,
      text: 'Not connected',
      tone: 'warning',
    })
  })

  test('links to Options when the stored token was rejected', () => {
    // Arrange
    const connectionStatus = 'rejected'

    // Act
    const statusMessage = getPopupStatusMessage('', connectionStatus)

    // Assert
    expect(statusMessage).toEqual({
      hasOptionsLink: true,
      text: 'Token rejected',
      tone: 'warning',
    })
  })

  test('leaves the slot to the favicon and domain while connected with nothing to report', () => {
    // Arrange
    const connectionStatus = 'connected'

    // Act
    const statusMessage = getPopupStatusMessage('', connectionStatus)

    // Assert
    expect(statusMessage).toBeNull()
  })

  test('shows no notice while the stored token is still loading', () => {
    // Arrange
    const connectionStatus = 'loading'

    // Act
    const statusMessage = getPopupStatusMessage('', connectionStatus)

    // Assert
    expect(statusMessage).toBeNull()
  })
})
