import { useCallback, useState } from 'react'

export interface ConnectionBarState {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

/**
 * Open/closed state of the collapsible "Connected to NSX" bar, so a connected popup stays compact; {@link App} toggles it from the status dot and closes it on Escape, Connect, and Disconnect.
 * @returns
 * - isOpen: whether the bar is expanded (starts collapsed)
 * - toggle: flips the bar; wired to the status dot
 * - close: collapses the bar, so every new connection starts compact again
 * @example
 * const connectionBar = useConnectionBar() // isOpen => false
 * connectionBar.toggle() // isOpen => true
 * connectionBar.close() // isOpen => false
 */
export const useConnectionBar = (): ConnectionBarState => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggle = useCallback((): void => {
    setIsOpen((wasOpen) => !wasOpen)
  }, [])

  const close = useCallback((): void => {
    setIsOpen(false)
  }, [])

  return { isOpen, toggle, close }
}
