import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { memo } from 'react'

import TweetLink from '@/src/components/Sidebar/TweetLink'

import { useIsomorphicEffect } from '../../hooks/useIsomorphicEffect'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'
import { selectSidebarOpen, toggleSidebar } from '../../redux/sidebarSlice'
import { dispatch } from '../../redux/store'

import CreateLink from './CreateLink'
import DashboardLink from './DashboardLink'
import LoginLink from './LoginLink'
import LogoutLink from './LogoutLink'
import { onCloseHander } from './onCloseHander'
import SettingLink from './SettingLink'

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

  useIsomorphicEffect(() => {
    window.document.addEventListener('keyup', keypressListener)

    return () => {
      window.document.removeEventListener('keyup', keypressListener)
    }
  }, [])

  // Keep the closed state out of the DOM so keyboard users do not tab into hidden links.
  if (!open) return null

  return (
    <section
      aria-label="Sidebar navigation"
      aria-modal="true"
      className="relative z-40"
      role="dialog"
    >
      <div className="bg-opacity-75 fixed inset-0 bg-gray-600" />

      <div className="fixed inset-0 z-40 flex" onClick={onCloseHander}>
        <aside
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
