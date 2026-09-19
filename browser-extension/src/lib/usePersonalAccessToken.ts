import { useCallback, useEffect, useState } from 'react'

import { PAT_TOKEN_PATTERN } from './constants'
import {
  clearStoredPatToken,
  markStoredPatTokenRejected,
  readStoredPatConnection,
  subscribeToStoredPatChanges,
  writeStoredPatToken,
  type StoredPatConnection,
} from './patStorage'

/**
 * - `loading`: the first chrome.storage.local read is still in flight
 * - `connected`: a token is stored and the API has not rejected it
 * - `disconnected`: no token is stored
 * - `rejected`: the API answered 401 to the stored token, so the owner has to paste a new one
 */
export type PatConnectionStatus =
  'loading' | 'connected' | 'disconnected' | 'rejected'

export interface PersonalAccessTokenState {
  /** The stored raw token (also while it is `rejected`), or null when none is stored. */
  token: StoredPatConnection['token']
  connectionStatus: PatConnectionStatus
  /** Stores the trimmed token and marks the extension connected; resolves false, storing nothing, when it is not an NSX token. */
  connect: (rawToken: string) => Promise<boolean>
  /** Clears the stored token and returns to the disconnected state. */
  disconnect: () => Promise<void>
  /** Flags that the stored token was rejected, here and in storage, so every extension page asks to reconnect. */
  markRejected: () => void
}

const NOT_CONNECTED: StoredPatConnection = { token: null, isRejected: false }

/**
 * Mirrors the extension PAT kept in chrome.storage.local: the popup reads it to authenticate saves and flags a 401,
 * the Options page connects and disconnects. Follows storage changes, so an open Options tab sees a rejection the popup found.
 * @returns The stored token, its connection status, and the connect/disconnect/markRejected actions.
 * @example
 * const { token, connectionStatus, markRejected } = usePersonalAccessToken() // popup
 * const { token, connectionStatus, connect, disconnect } = usePersonalAccessToken() // Options page
 */
export const usePersonalAccessToken = (): PersonalAccessTokenState => {
  const [connection, setConnection] =
    useState<StoredPatConnection>(NOT_CONNECTED)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Read the stored connection on mount and again whenever another page changes it; the guard avoids
  // a setState after unmount. .finally clears isLoading even if the storage read rejects, so a failed
  // read can't pin the status at `loading` and stall the popup's existence-check effect forever.
  useEffect(() => {
    let isActive = true

    const loadStoredConnection = (): void => {
      readStoredPatConnection()
        .then((storedConnection) => {
          if (isActive) setConnection(storedConnection)
        })
        .finally(() => {
          if (isActive) setIsLoading(false)
        })
    }

    loadStoredConnection()
    const unsubscribe = subscribeToStoredPatChanges(loadStoredConnection)

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [])

  const connect = useCallback(async (rawToken: string): Promise<boolean> => {
    const trimmedToken = rawToken.trim()
    // A truncated or wrong paste would read as "Connected" until the first save came back 401.
    if (!PAT_TOKEN_PATTERN.test(trimmedToken)) return false
    await writeStoredPatToken(trimmedToken)
    setConnection({ token: trimmedToken, isRejected: false })
    return true
  }, [])

  const disconnect = useCallback(async (): Promise<void> => {
    await clearStoredPatToken()
    setConnection(NOT_CONNECTED)
  }, [])

  // Stable so the existence-check effect can depend on it without re-running each render.
  const markRejected = useCallback((): void => {
    setConnection((currentConnection) =>
      currentConnection.isRejected
        ? currentConnection
        : { ...currentConnection, isRejected: true },
    )
    void markStoredPatTokenRejected()
  }, [])

  return {
    token: connection.token,
    connectionStatus: getConnectionStatus(connection, isLoading),
    connect,
    disconnect,
    markRejected,
  }
}

/**
 * Folds the stored connection and the loading flag into the one status both extension pages branch on.
 * @param connection - The token and rejected flag last read from chrome.storage.local.
 * @param isLoading - True until the first storage read settles.
 * @returns The {@link PatConnectionStatus} for that combination.
 * @example
 * getConnectionStatus({ token: 'nsx_pat_x', isRejected: false }, false) // => 'connected'
 * getConnectionStatus({ token: 'nsx_pat_x', isRejected: true }, false)  // => 'rejected'
 * getConnectionStatus({ token: null, isRejected: false }, true)         // => 'loading'
 */
const getConnectionStatus = (
  connection: StoredPatConnection,
  isLoading: boolean,
): PatConnectionStatus => {
  if (isLoading) return 'loading'
  if (connection.token === null) return 'disconnected'

  return connection.isRejected ? 'rejected' : 'connected'
}
