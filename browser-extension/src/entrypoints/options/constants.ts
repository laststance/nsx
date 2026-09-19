// Label of the token field, shown while no usable token is connected.
export const CONNECT_PROMPT_MESSAGE =
  'Paste your NSX token to save pages from this extension.'
// Shown under the token field when the pasted value is not shaped like an NSX token (nothing is stored).
export const INVALID_TOKEN_MESSAGE =
  "That doesn't look like an NSX token. Paste the whole nsx_pat_… value."
// Shown in the same place when chrome.storage refused to save the token; the pasted value stays for a retry.
export const TOKEN_NOT_SAVED_MESSAGE =
  "Couldn't save the token. Press Connect to try again."
// Alert shown when the stored token was rejected (revoked/expired) by the API with 401.
export const RECONNECT_PROMPT_MESSAGE =
  'Your saved token was rejected. Paste a new token to reconnect.'
// Where the owner mints a token; it is shown only once there, then pasted into this page.
export const EXTENSION_TOKEN_SETTINGS_URL =
  'https://nsx.malloc.tokyo/dashboard/settings/extension-token'
