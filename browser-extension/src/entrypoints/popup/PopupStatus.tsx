import React, { useState, type FC } from 'react'

import { OPEN_OPTIONS_LABEL } from './constants'
import type { PopupStatusMessage } from './utils/getPopupStatusMessage'

interface PopupStatusProps {
  /** Domain of the current tab; '' leaves the idle line empty. */
  domain: string
  /** The message to show, or null to show the domain. */
  message: PopupStatusMessage | null
  /** Runs when the "Open options" link of a connection notice is clicked. */
  onOpenOptions: () => void
}

/**
 * The popup's top-left status slot: the domain while idle, cross-fading to a small save / connection message.
 * Both layers stay mounted so a message can fade out as well as in; rendered once by the popup {@link App}.
 * @returns The status slot, whose message layer is the popup's `role="status"` live region.
 * @example
 * <PopupStatus domain="example.com" message={null} onOpenOptions={openOptionsPage} />
 */
const PopupStatus: FC<PopupStatusProps> = ({
  domain,
  message,
  onOpenOptions,
}) => {
  // The message that is fading out stays rendered; without it the text would vanish before the fade ends.
  const [retainedMessage, setRetainedMessage] = useState(message)
  if (message !== null && message.text !== retainedMessage?.text) {
    setRetainedMessage(message)
  }

  const isMessageShown = message !== null
  const messageLayerClassName = [
    'status-layer',
    'status-message',
    retainedMessage ? `tone-${retainedMessage.tone}` : '',
    isMessageShown ? 'is-shown' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="status">
      {/* Inline visibility is the shown/hidden state itself; style.css delays it until the fade-out ends. */}
      <div
        className={
          isMessageShown
            ? 'status-layer status-idle'
            : 'status-layer status-idle is-shown'
        }
        style={{ visibility: isMessageShown ? 'hidden' : 'visible' }}
      >
        {domain ? <span className="status-domain">{domain}</span> : null}
      </div>
      <div role="status">
        <div
          className={messageLayerClassName}
          style={{ visibility: isMessageShown ? 'visible' : 'hidden' }}
        >
          {retainedMessage ? (
            <>
              <StatusIcon tone={retainedMessage.tone} />
              <span>{retainedMessage.text}</span>
              {retainedMessage.hasOptionsLink ? (
                <>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    className="status-link"
                    onClick={onOpenOptions}
                  >
                    {OPEN_OPTIONS_LABEL}
                  </button>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default PopupStatus

const STATUS_ICON_PATHS: Record<PopupStatusMessage['tone'], string> = {
  error: 'M4 4l8 8M12 4l-8 8',
  success: 'M3.2 8.6l3 3 6.6-7.2',
  warning: 'M8 3v6M8 12.4v.2',
}

const StatusIcon: FC<{ tone: PopupStatusMessage['tone'] }> = ({ tone }) => (
  <svg
    className="status-icon"
    viewBox="0 0 16 16"
    width="12"
    height="12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={STATUS_ICON_PATHS[tone]} />
  </svg>
)
