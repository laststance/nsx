import { PAT_REJECTED_STORAGE_KEY, PAT_STORAGE_KEY } from './constants'

export interface StoredPatConnection {
  /** The raw `nsx_pat_…` token, or null when nothing valid is stored. */
  token: string | null
  /** True when the API answered 401 to this token, so the owner has to paste a new one. */
  isRejected: boolean
}

/**
 * Reads the saved NSX PAT and its rejected flag from chrome.storage.local; runs when the popup or the Options page mounts and after every storage change.
 * @returns The stored token (null when not connected) and whether the API rejected it.
 * @example
 * await readStoredPatConnection() // => { token: 'nsx_pat_abc…', isRejected: false }
 * await readStoredPatConnection() // => { token: null, isRejected: false }  (not connected)
 */
export const readStoredPatConnection =
  async (): Promise<StoredPatConnection> => {
    const storedItems = await chrome.storage.local.get([
      PAT_STORAGE_KEY,
      PAT_REJECTED_STORAGE_KEY,
    ])
    const storedToken = storedItems[PAT_STORAGE_KEY]
    const hasToken = typeof storedToken === 'string' && storedToken.length > 0

    return {
      token: hasToken ? storedToken : null,
      // A flag without a token is stale; only a stored token can be rejected.
      isRejected: hasToken && storedItems[PAT_REJECTED_STORAGE_KEY] === true,
    }
  }

/**
 * Persists the pasted PAT so later popup opens stay connected; called when the owner clicks Connect on the Options page.
 * @param rawToken - The raw `nsx_pat_…` token to store.
 * @returns Nothing once the token is written and the previous token's rejected flag is cleared in the same write.
 * @example
 * await writeStoredPatToken('nsx_pat_abc…')
 */
export const writeStoredPatToken = async (rawToken: string): Promise<void> => {
  await chrome.storage.local.set({
    [PAT_STORAGE_KEY]: rawToken,
    [PAT_REJECTED_STORAGE_KEY]: false,
  })
}

/**
 * Removes the stored PAT and its rejected flag; called when the owner clicks Disconnect on the Options page.
 * @returns Nothing once both values are cleared from chrome.storage.local.
 * @example
 * await clearStoredPatToken()
 */
export const clearStoredPatToken = async (): Promise<void> => {
  await chrome.storage.local.remove([PAT_STORAGE_KEY, PAT_REJECTED_STORAGE_KEY])
}

/**
 * Flags the stored PAT as rejected (the token itself stays, so the Options page can name it); called when the API answers 401 to it.
 * @returns Nothing once the flag is written to chrome.storage.local.
 * @example
 * await markStoredPatTokenRejected()
 */
export const markStoredPatTokenRejected = async (): Promise<void> => {
  await chrome.storage.local.set({ [PAT_REJECTED_STORAGE_KEY]: true })
}

/**
 * Subscribes to PAT changes made by another extension page, e.g. the popup flagging a rejection while the Options tab is open; used by {@link usePersonalAccessToken}.
 * @param onPatChange - Called after the stored token or its rejected flag changed.
 * @returns A function that removes the listener.
 * @example
 * const unsubscribe = subscribeToStoredPatChanges(() => void reloadConnection())
 */
export const subscribeToStoredPatChanges = (
  onPatChange: () => void,
): (() => void) => {
  const handleStorageChange = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string,
  ): void => {
    if (areaName !== 'local') return
    // Other keys in chrome.storage.local are none of the connection's business.
    if (PAT_STORAGE_KEY in changes || PAT_REJECTED_STORAGE_KEY in changes) {
      onPatChange()
    }
  }

  chrome.storage.onChanged.addListener(handleStorageChange)
  return () => chrome.storage.onChanged.removeListener(handleStorageChange)
}
