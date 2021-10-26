import React, { memo } from 'react'

import { formatDate } from '../lib/formatDate'

const PostDate = memo<{ date: string }>(
  ({ date }) => {
    return (
      <div className="flex-initial w-24 text-lg text-center text-gray-500">
        {formatDate(date)}
      </div>
    )
  },
  () => true
)

PostDate.displayName = 'PostDate'

export default PostDate
