import { useCallback, useEffect, useState } from 'react'

import {
  clearStoredPatToken,
  readStoredPatToken,
  writeStoredPatToken,
} from './utils/patStorage'

export interface PersonalAccessTokenState {
  /** The connected raw token, or null when no valid token is stored. */
  token: string | null
  /** True while the initial chrome.storage.local read is in flight. */
  isLoading: boolean
  /** True when a stored token was rejected with 401 and the owner should re-paste. */
  needsReconnect: boolean
  /** Controlled value of the paste input. */
  inputToken: string
  /** Updates the paste input value. */
  setInputToken: (value: string) => void
  /** Stores the trimmed paste-input token and marks the extension connected. */
  connect: () => Promise<void>
  /** Clears the stored token and returns to the disconnected state. */
  disconnect: () => Promise<void>
  /** Flags that the stored token was rejected so the reconnect prompt appears. */
  markRejected: () => void
}

/**
 * Owns the extension PAT for the popup save flow: loads it from chrome.storage.local on mount,
 * exposes connect/disconnect, and flags reconnect when a stored token is rejected with 401.
 * Extracted from App so the component keeps a single state cluster (per the 3+ useState rule).
 * @returns Token state plus the paste-input value and connect/disconnect/markRejected actions.
 * @example
 * const { token, inputToken, setInputToken, connect } = usePersonalAccessToken()
 */
export const usePersonalAccessToken = (): PersonalAccessTokenState => {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [needsReconnect, setNeedsReconnect] = useState<boolean>(false)
  const [inputToken, setInputToken] = useState<string>('')

  // Read the stored token once on mount; the guard avoids a setState after unmount.
  // .finally clears isLoading even if the storage read rejects, so a failed read
  // can't pin isLoading=true and stall App's existence-check effect forever.
  useEffect(() => {
    let isActive = true
    readStoredPatToken()
      .then((storedToken) => {
        if (!isActive) return
        setToken(storedToken)
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })
    return () => {
      isActive = false
    }
  }, [])

  const connect = useCallback(async (): Promise<void> => {
    const trimmedToken = inputToken.trim()
    if (!trimmedToken) return
    await writeStoredPatToken(trimmedToken)
    setToken(trimmedToken)
    setNeedsReconnect(false)
    setInputToken('')
  }, [inputToken])

  const disconnect = useCallback(async (): Promise<void> => {
    await clearStoredPatToken()
    setToken(null)
    setNeedsReconnect(false)
  }, [])

  // Stable so the existence-check effect can depend on it without re-running each render.
  const markRejected = useCallback((): void => {
    setNeedsReconnect(true)
  }, [])

  return {
    token,
    isLoading,
    needsReconnect,
    inputToken,
    setInputToken,
    connect,
    disconnect,
    markRejected,
  }
}
