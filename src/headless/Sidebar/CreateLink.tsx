import { PlusIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'

import { html } from '../../lib/html'

import { onCloseHander } from './'

const CreateLink: React.FC = html(() => {
  return (
    <Link
      onClick={onCloseHander}
      to="/dashboard/create"
      data-cy="create-link"
      className="group flex items-center rounded-md bg-gray-900 px-2 py-2 text-base font-medium text-white"
    >
      <PlusIcon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-300" />
      Create
    </Link>
  )
})
CreateLink.displayName = 'CreateLink'

export default CreateLink
