import { PAT_STORAGE_KEY } from '../constants'

/**
 * Reads the saved NSX PAT from chrome.storage.local; runs on popup mount and before each stock request.
 * @returns The raw `nsx_pat_…` token string, or null when nothing valid is stored.
 * @example
 * await readStoredPatToken() // => 'nsx_pat_abc…'  (or null when not connected)
 */
export const readStoredPatToken = async (): Promise<string | null> => {
  const storedItems = await chrome.storage.local.get(PAT_STORAGE_KEY)
  const storedToken = storedItems[PAT_STORAGE_KEY]
  return typeof storedToken === 'string' && storedToken.length > 0
    ? storedToken
    : null
}

/**
 * Persists the pasted PAT so later popup opens stay connected; called when the owner clicks Connect.
 * @param rawToken - The raw `nsx_pat_…` token to store.
 * @returns Nothing once the value is written to chrome.storage.local.
 * @example
 * await writeStoredPatToken('nsx_pat_abc…')
 */
export const writeStoredPatToken = async (rawToken: string): Promise<void> => {
  await chrome.storage.local.set({ [PAT_STORAGE_KEY]: rawToken })
}

/**
 * Removes the stored PAT; called when the owner disconnects (token rejection keeps the value for re-paste UX).
 * @returns Nothing once the value is cleared from chrome.storage.local.
 * @example
 * await clearStoredPatToken()
 */
export const clearStoredPatToken = async (): Promise<void> => {
  await chrome.storage.local.remove(PAT_STORAGE_KEY)
}
