import { PlusIcon } from '@heroicons/react/24/outline'
import React, { memo } from 'react'
import { Link } from 'react-router'

import { onCloseHander } from './onCloseHander'

const CreateLink: React.FC = memo(
  () => {
    return (
      <Link
        onClick={onCloseHander}
        to="/dashboard/create"
        data-testid="create-link"
        className="group flex items-center rounded-md bg-gray-900 px-2 py-2 text-base font-medium text-white"
      >
        <PlusIcon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-300" />
        Create
      </Link>
    )
  },
  () => true,
)
CreateLink.displayName = 'CreateLink'

export default CreateLink
