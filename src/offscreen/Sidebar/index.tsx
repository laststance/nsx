import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { Fragment, memo, useEffect } from 'react'

import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'
import {
  selectSidebarOpen,
  closeSidebar,
  toggleSidebar,
} from '../../redux/sidebarSlice'
import { dispatch } from '../../redux/store'

import LoginLink from './LoginLink'
import LogoutLink from './LogoutLink'
import SettingLink from './SettingLink'

Dialog.displayName = 'Dialog'
Dialog.Panel.displayName = 'Dialog.Panel'
Transition.Root.displayName = 'Transition.Root'
Transition.Child.displayName = 'Transition.Child'

export const keypressListener = (e: KeyboardEvent) => {
  // @TODO add (if not while typing in a text input
  if (e.key === 'x') dispatch(toggleSidebar())
}

export function onCloseHander() {
  dispatch(closeSidebar())
}

const Sidebar: React.FC = memo(() => {
  const open = useAppSelector(selectSidebarOpen)
  const login = useAppSelector(selectLogin)

  useEffect(() => {
    window.document.addEventListener('keyup', keypressListener)
  }, [])

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="section" className="relative z-40" onClose={onCloseHander}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={onCloseHander}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {login ? <LogoutLink /> : <LoginLink />}
                    {login && <SettingLink />}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
})
Sidebar.displayName = 'Offscreen.Sidebar'

export default Sidebar
