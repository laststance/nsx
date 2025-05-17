import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { memo, Fragment } from 'react'

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

Dialog.displayName = 'Dialog'
Dialog.Panel.displayName = 'Dialog.Panel'
Transition.Root.displayName = 'Transition.Root'
Transition.Child.displayName = 'Transition.Child'

const keypressListener = (e: KeyboardEvent) => {
  // @TODO add (if not while typing in a text input
  if (e.key === 'x') dispatch(toggleSidebar())
}

const Sidebar: React.FC = memo(() => {
  const open = useAppSelector(selectSidebarOpen)
  const login = useAppSelector(selectLogin)

  useIsomorphicEffect(() => {
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
            <div className="bg-opacity-75 fixed inset-0 bg-gray-600" />
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
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
})
Sidebar.displayName = 'HeadlessEffect.Sidebar'

export default Sidebar
