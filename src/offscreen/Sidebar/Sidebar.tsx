import { Dialog, Transition } from '@headlessui/react'
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline'
import React, { Fragment, memo, useEffect } from 'react'

import { useAppSelector } from '../../redux/hooks'
import { dispatch } from '../../redux/store'

import { selectSidebarOpen, closeSidebar, openSidebar } from './sidebarSlice'

Dialog.displayName = 'Dialog'
Dialog.Panel.displayName = 'Dialog.Panel'
Transition.Root.displayName = 'Transition.Root'
Transition.Child.displayName = 'Transition.Child'

const navigation = [
  { current: true, href: '#', icon: HomeIcon, name: 'Dashboard' },
  { current: false, href: '#', icon: UsersIcon, name: 'Team' },
  { current: false, href: '#', icon: FolderIcon, name: 'Projects' },
  { current: false, href: '#', icon: CalendarIcon, name: 'Calendar' },
  { current: false, href: '#', icon: InboxIcon, name: 'Documents' },
  { current: false, href: '#', icon: ChartBarIcon, name: 'Reports' },
]
const keypressListener = (e: KeyboardEvent) => {
  if (e.key === 'x') dispatch(openSidebar())
}

function onCloseHander() {
  dispatch(closeSidebar())
}

const Sidebar: React.FC = memo(() => {
  const open = useAppSelector(selectSidebarOpen)
  useEffect(() => {
    window.document.addEventListener('keyup', keypressListener)
  }, [])

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={onCloseHander}>
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
                      <XIcon
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
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="group flex items-center rounded-md bg-gray-900 px-2 py-2 text-base font-medium text-white"
                      >
                        <item.icon className="'text-gray-300 flex-shrink-0' mr-4 h-6 w-6" />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
})
Sidebar.displayName = 'Offscreen.Sidebar'

export default Sidebar
