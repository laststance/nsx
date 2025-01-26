import React, { memo } from 'react'

import { formatDate } from '../../lib/formatDate'

const PostDate: React.FC<React.PropsWithChildren<{ date: string }>> = memo(
  ({ date }) => {
    return (
      <div className="w-24 flex-initial shrink-0 text-center text-lg text-gray-500">
        {formatDate(date)}
      </div>
    )
  },
)
PostDate.displayName = 'PostDate'

export default PostDate
