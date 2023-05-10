import { HomeIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'

import Memo from '../../lib/memo'

import { onCloseHander } from './'

const DashboardLink: React.FC = Memo.html(() => {
  return (
    <Link
      onClick={onCloseHander}
      to="/dashboard"
      data-cy="dashboard-link"
      className="group flex items-center rounded-md bg-gray-900 px-2 py-2 text-base font-medium text-white"
    >
      <HomeIcon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-300" />
      Dashboard
    </Link>
  )
})
DashboardLink.displayName = 'DashboardLink'

export default DashboardLink
