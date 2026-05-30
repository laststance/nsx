export const ALREADY_EXISTS_MESSAGE = 'Already Exists'
export const DEFAULT_API_ENDPOINT = 'http://localhost:4000/api/'
export const FAILED_MESSAGE = 'Failed...'
export const FEEDBACK_CLEAR_DELAY_MS = 1000
export const SUCCESS_MESSAGE = 'Success!'

// chrome.storage.local key holding the pasted NSX Personal Access Token (raw `nsx_pat_…`).
export const PAT_STORAGE_KEY = 'nsx_pat'
// Prompt shown when no token is connected yet.
export const CONNECT_PROMPT_MESSAGE =
  'Paste your NSX token to save pages from this extension.'
// Alert shown when a stored token is rejected (revoked/expired) by the API with 401.
export const RECONNECT_PROMPT_MESSAGE =
  'Your saved token was rejected. Paste a new token to reconnect.'
// Label shown when a valid token is connected.
export const CONNECTED_MESSAGE = 'Connected to NSX'
