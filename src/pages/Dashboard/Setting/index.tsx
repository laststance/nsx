import {
  CreditCardIcon,
  BuildingOfficeIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/solid'
import clsx from 'clsx'
import React, { memo } from 'react'
import type { ComponentProps } from 'react'
import { Link, Routes, Route, Outlet, useLocation } from 'react-router'

import Layout from '@/src/components/Layout'

import MyAccount from './MyAccount'

const TabRouterContainer: React.FC<ComponentProps<'section'>> = ({
  children,
}) => (
  <>
    <section>{children}</section>
    <Outlet />
  </>
)

const tabs = [
  { name: 'My Account', icon: UserIcon, path: 'my-account' },
  { name: 'Company', icon: BuildingOfficeIcon, path: 'company' },
  { name: 'Team Members', icon: UsersIcon, path: 'team-member' },
  { name: 'Billing', icon: CreditCardIcon, path: 'billing' },
]

const Setting: React.FC = memo(() => {
  const currentPath = useLocation().pathname.split('/')[3]
  return (
    <TabRouterContainer>
      <nav
        className="-mb-px flex space-x-8 border-b border-gray-200"
        aria-label="Tabs"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            to={tab.path}
            className={clsx(
              'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
              tab.path === currentPath
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            )}
            aria-current={tab.path === currentPath ? 'page' : undefined}
          >
            <tab.icon
              className={clsx(
                '-ml-0.5 mr-2 h-5 w-5',
                tab.path === currentPath
                  ? 'text-indigo-500'
                  : 'text-gray-400 group-hover:text-gray-500',
              )}
              aria-hidden="true"
            />
            <span>{tab.name}</span>
          </Link>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<TabRouterContainer />}>
          <Route index element={<MyAccount />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="company" element={<h1>Company</h1>} />
          <Route path="team-member" element={<h1>Team Member</h1>} />
          <Route path="billing" element={<h1>Billing</h1>} />
        </Route>
      </Routes>
    </TabRouterContainer>
  )
})
Setting.displayName = 'Setting'

const SettingPage = memo(() => (
  <Layout className="flex flex-col justify-start">
    <Setting />
  </Layout>
))
SettingPage.displayName = 'SettingPage'

export default SettingPage
