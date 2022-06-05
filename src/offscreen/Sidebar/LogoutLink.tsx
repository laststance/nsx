import { LogoutIcon } from '@heroicons/react/outline'
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { handleLogout } from '../../handler'

const LogoutLink: React.FC = memo(
  () => {
    const navigate = useNavigate()
    return (
      <button
        onClick={(e) => handleLogout(e, navigate)}
        data-cy="logout-link"
        className="group flex w-full items-center rounded-md bg-gray-900 px-2 py-2 text-base font-medium text-white"
      >
        <LogoutIcon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-300" />
        Logout
      </button>
    )
  },
  () => true
)
LogoutLink.displayName = 'LogoutLink'

export default LogoutLink
