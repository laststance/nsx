import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { memo, useRef } from 'react'

import TweetLink from '@/src/components/Sidebar/TweetLink'

import { useIsomorphicEffect } from '../../hooks/useIsomorphicEffect'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'
import {
  closeSidebar,
  selectSidebarOpen,
  toggleSidebar,
} from '../../redux/sidebarSlice'
import { dispatch } from '../../redux/store'

import CreateLink from './CreateLink'
import DashboardLink from './DashboardLink'
import LoginLink from './LoginLink'
import LogoutLink from './LogoutLink'
import { onCloseHander } from './onCloseHander'
import SettingLink from './SettingLink'

const FOCUSABLE_SIDEBAR_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Returns keyboard-focusable elements inside the open sidebar.
 * @param container - The sidebar root element that owns focus while open.
 * @returns
 * - When mounted: focusable descendants in DOM order
 * - When unmounted: an empty array
 * @example
 * getFocusableElements(document.querySelector('aside')) // => [HTMLAnchorElement, HTMLButtonElement]
 */
const getFocusableElements = (container: HTMLElement | null): HTMLElement[] => {
  if (!container) return []

  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SIDEBAR_SELECTOR),
  ).filter(isVisibleFocusableElement)
}

/**
 * Keeps hidden or inert nodes out of manual focus trap cycling.
 * @param element - A candidate element matched by the focusable selector.
 * @returns Whether the element can currently receive keyboard focus.
 * @example
 * isVisibleFocusableElement(document.createElement('button')) // => true
 */
const isVisibleFocusableElement = (element: HTMLElement): boolean => {
  return Boolean(element.offsetParent || element.getClientRects().length)
}

/**
 * Toggles the sidebar from the global shortcut used by the admin flows.
 * @param event - The keyup event emitted by the document.
 * @returns Nothing; dispatches only when the shortcut key is pressed.
 * @example
 * keypressListener(new KeyboardEvent('keyup', { key: 'x' }))
 */
const keypressListener = (event: KeyboardEvent) => {
  // @TODO add (if not while typing in a text input
  if (event.key === 'x') dispatch(toggleSidebar())
}

/**
 * Renders the app navigation drawer without Headless UI so the app has fewer runtime dependencies.
 * @returns The open sidebar dialog, or null when the sidebar is closed.
 * @example
 * <Sidebar />
 */
const Sidebar: React.FC = memo(() => {
  const open = useAppSelector(selectSidebarOpen)
  const login = useAppSelector(selectLogin)
  const sidebarRef = useRef<HTMLElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  useIsomorphicEffect(() => {
    window.document.addEventListener('keyup', keypressListener)

    return () => {
      window.document.removeEventListener('keyup', keypressListener)
    }
  }, [])

  useIsomorphicEffect(() => {
    // Focus management is only active while the dialog markup exists.
    if (!open) return undefined

    const activeElement = window.document.activeElement
    previouslyFocusedElementRef.current =
      activeElement instanceof HTMLElement ? activeElement : null

    const [firstFocusableElement] = getFocusableElements(sidebarRef.current)
    firstFocusableElement?.focus()

    return () => {
      // Restore focus to the opener when the sidebar unmounts after close.
      if (previouslyFocusedElementRef.current?.isConnected) {
        previouslyFocusedElementRef.current.focus()
      }
    }
  }, [open])

  const handleSidebarKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      dispatch(closeSidebar())
      return
    }

    // Only Tab needs wrapping; all other keys keep their native behavior.
    if (event.key !== 'Tab') return

    const focusableElements = getFocusableElements(sidebarRef.current)
    const [firstFocusableElement] = focusableElements
    const lastFocusableElement = focusableElements.at(-1)

    if (!firstFocusableElement || !lastFocusableElement) {
      event.preventDefault()
      return
    }

    if (
      event.shiftKey &&
      window.document.activeElement === firstFocusableElement
    ) {
      event.preventDefault()
      lastFocusableElement.focus()
      return
    }

    if (
      !event.shiftKey &&
      window.document.activeElement === lastFocusableElement
    ) {
      event.preventDefault()
      firstFocusableElement.focus()
    }
  }

  // Keep the closed state out of the DOM so keyboard users do not tab into hidden links.
  if (!open) return null

  return (
    <section
      aria-label="Sidebar navigation"
      aria-modal="true"
      className="relative z-40"
      role="dialog"
      onKeyDown={handleSidebarKeyDown}
    >
      <div className="bg-opacity-75 fixed inset-0 bg-gray-600" />

      <div className="fixed inset-0 z-40 flex" onClick={onCloseHander}>
        <aside
          ref={sidebarRef}
          className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4"
          onClick={(event) => {
            // Prevent clicks inside the drawer from bubbling to the backdrop close handler.
            event.stopPropagation()
          }}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
              onClick={onCloseHander}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex shrink-0 items-center px-4">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
              alt="Workflow"
            />
          </div>
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {login ? <LogoutLink /> : <LoginLink />}
              {login && (
                <>
                  <SettingLink />
                  <DashboardLink />
                  <CreateLink />
                  <TweetLink />
                </>
              )}
            </nav>
          </div>
        </aside>
      </div>
    </section>
  )
})
Sidebar.displayName = 'Sidebar'

export default Sidebar
