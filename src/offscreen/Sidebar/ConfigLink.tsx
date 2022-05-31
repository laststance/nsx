import { CogIcon } from '@heroicons/react/outline'
import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import { onCloseHander } from './Sidebar'

const ConfigLink: React.FC = memo(() => {
  return (
    <Link
      onClick={onCloseHander}
      to="/dashboard/config"
      data-cy="config-link"
      className="group flex items-center rounded-md bg-gray-900 px-2 py-2 text-base font-medium text-white"
    >
      <CogIcon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-300" />
      Config
    </Link>
  )
})
ConfigLink.displayName = 'ConfigLink'

export default ConfigLink
