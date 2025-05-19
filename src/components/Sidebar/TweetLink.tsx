import { Bird } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

import { onCloseHander } from './onCloseHander'

const CreateLink: React.FC = () => {
  return (
    <Link
      onClick={onCloseHander}
      to="/dashboard/tweet"
      data-testid="tweet-link"
      className="group flex items-center rounded-md bg-gray-900 px-2 py-2 text-base font-medium text-white"
    >
      <Bird className="mr-4 h-6 w-6 shrink-0 text-gray-300" />
      Tweet
    </Link>
  )
}

export default CreateLink
