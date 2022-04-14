import React, { memo } from 'react'

import { formatDate } from '../lib/formatDate'

const PostDate: React.FC<React.PropsWithChildren<{ date: string }>> = memo(
  ({ date }) => {
    return (
      <div className="w-24 flex-initial text-center text-lg text-gray-500">
        {formatDate(date)}
      </div>
    )
  },
  () => true
)
PostDate.displayName = 'PostDate'

export default PostDate
