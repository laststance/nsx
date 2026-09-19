import {
  NOT_CONNECTED_MESSAGE,
  TOKEN_REJECTED_MESSAGE,
} from '../../../lib/constants'
import type { PatConnectionStatus } from '../../../lib/usePersonalAccessToken'
import {
  ALREADY_EXISTS_MESSAGE,
  FAILED_MESSAGE,
  SUCCESS_MESSAGE,
} from '../constants'

export type FeedbackMessage =
  | ''
  | typeof ALREADY_EXISTS_MESSAGE
  | typeof FAILED_MESSAGE
  | typeof SUCCESS_MESSAGE

export interface PopupStatusMessage {
  /** Picks the color and the icon: green check, red cross, or amber exclamation mark. */
  tone: 'success' | 'error' | 'warning'
  text: string
  /** True when the message ends with the "Open options" link. */
  hasOptionsLink: boolean
}

const FEEDBACK_STATUS_MESSAGES: Record<
  Exclude<FeedbackMessage, ''>,
  PopupStatusMessage
> = {
  [ALREADY_EXISTS_MESSAGE]: {
    tone: 'success',
    text: ALREADY_EXISTS_MESSAGE,
    hasOptionsLink: false,
  },
  [FAILED_MESSAGE]: {
    tone: 'error',
    text: FAILED_MESSAGE,
    hasOptionsLink: false,
  },
  [SUCCESS_MESSAGE]: {
    tone: 'success',
    text: SUCCESS_MESSAGE,
    hasOptionsLink: false,
  },
}

const NOT_CONNECTED_STATUS_MESSAGE: PopupStatusMessage = {
  tone: 'warning',
  text: NOT_CONNECTED_MESSAGE,
  hasOptionsLink: true,
}

const TOKEN_REJECTED_STATUS_MESSAGE: PopupStatusMessage = {
  tone: 'warning',
  text: TOKEN_REJECTED_MESSAGE,
  hasOptionsLink: true,
}

/**
 * Picks what the popup's top-left status slot says; called on every render of the popup {@link App}.
 * @param feedbackMessage - The save feedback currently up, or '' when there is none.
 * @param connectionStatus - Whether a usable NSX token is stored.
 * @returns
 * - While save feedback is up: that feedback (it outranks a connection notice, so Failed... stays readable after a 401)
 * - Without a usable token: the "Not connected" / "Token rejected" notice with the Open options link
 * - Otherwise (connected, or the token is still loading): null, so the slot shows the favicon and domain
 * @example
 * getPopupStatusMessage('Success!', 'connected') // => { tone: 'success', text: 'Success!', hasOptionsLink: false }
 * getPopupStatusMessage('', 'disconnected')      // => { tone: 'warning', text: 'Not connected', hasOptionsLink: true }
 * getPopupStatusMessage('', 'connected')         // => null
 */
export const getPopupStatusMessage = (
  feedbackMessage: FeedbackMessage,
  connectionStatus: PatConnectionStatus,
): PopupStatusMessage | null => {
  if (feedbackMessage !== '') return FEEDBACK_STATUS_MESSAGES[feedbackMessage]
  if (connectionStatus === 'rejected') return TOKEN_REJECTED_STATUS_MESSAGE
  if (connectionStatus === 'disconnected') return NOT_CONNECTED_STATUS_MESSAGE

  return null
}
