import React, { useState, type FC } from 'react'

import { OPEN_OPTIONS_LABEL } from './constants'
import type { PopupStatusMessage } from './utils/getPopupStatusMessage'

interface PopupStatusProps {
  /** Domain of the current tab; '' leaves the idle line empty. */
  domain: string
  /** Loadable favicon URL of the current tab; '' draws the globe icon instead. */
  faviconUrl: string
  /** The message to show, or null to show the favicon and domain. */
  message: PopupStatusMessage | null
  /** Runs when the "Open options" link of a connection notice is clicked. */
  onOpenOptions: () => void
}

/**
 * The popup's top-left status slot: favicon + domain while idle, cross-fading to a small save / connection message.
 * Both layers stay mounted so a message can fade out as well as in; rendered once by the popup {@link App}.
 * @returns The status slot, whose message layer is the popup's `role="status"` live region.
 * @example
 * <PopupStatus domain="example.com" faviconUrl="" message={null} onOpenOptions={openOptionsPage} />
 */
const PopupStatus: FC<PopupStatusProps> = ({
  domain,
  faviconUrl,
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
        {domain ? (
          <>
            {/* The key resets the load-failure state if the tab's favicon ever changes. */}
            <PageFavicon key={faviconUrl} faviconUrl={faviconUrl} />
            <span className="status-domain">{domain}</span>
          </>
        ) : null}
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

const PageFavicon: FC<{ faviconUrl: string }> = ({ faviconUrl }) => {
  const [didFailToLoad, setDidFailToLoad] = useState<boolean>(false)

  // No favicon, or one the site no longer serves: a neutral globe keeps the line's left edge in place.
  if (!faviconUrl || didFailToLoad) {
    return (
      <svg
        className="status-icon"
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="6.25" />
        <path d="M1.75 8h12.5M8 1.75c1.7 1.7 2.6 3.9 2.6 6.25S9.7 12.55 8 14.25C6.3 12.55 5.4 10.35 5.4 8S6.3 3.45 8 1.75z" />
      </svg>
    )
  }

  return (
    <img
      className="status-favicon"
      src={faviconUrl}
      alt=""
      width={14}
      height={14}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={(): void => setDidFailToLoad(true)}
    />
  )
}
