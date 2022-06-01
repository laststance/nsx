import {
  CreditCardIcon,
  OfficeBuildingIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/solid'
import React, { memo } from 'react'
import type { ComponentProps } from 'react'
import { Link, Routes, Route, Outlet, useLocation } from 'react-router-dom'

import Layout from '../../../components/Layout'

const tabs = [
  { icon: UserIcon, name: 'My Account', path: 'my-account' },
  { icon: OfficeBuildingIcon, name: 'Company', path: 'company' },
  { icon: UsersIcon, name: 'Team Members', path: 'team-member' },
  { icon: CreditCardIcon, name: 'Billing', path: 'billing' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Setting: React.FC = memo(() => {
  const currentPath = useLocation().pathname.split('/')[3]
  return (
    <Container>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            to={tab.path}
            className={classNames(
              tab.path === currentPath
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
            )}
            aria-current={tab.path === currentPath ? 'page' : undefined}
          >
            <tab.icon
              className={classNames(
                tab.path === currentPath
                  ? 'text-indigo-500'
                  : 'text-gray-400 group-hover:text-gray-500',
                '-ml-0.5 mr-2 h-5 w-5'
              )}
              aria-hidden="true"
            />
            <span>{tab.name}</span>
          </Link>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<Container />}>
          <Route index element={<MyAccount />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="company" element={<h1>Company</h1>} />
          <Route path="team-member" element={<h1>Team Member</h1>} />
          <Route path="billing" element={<h1>Billing</h1>} />
        </Route>
      </Routes>
    </Container>
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

const Container: React.FC<ComponentProps<'section'>> = ({ children }) => (
  <section className="border-b border-gray-200">
    {children}
    <Outlet />
  </section>
)

const MyAccount: React.FC = () => <div>MyAccount</div>
