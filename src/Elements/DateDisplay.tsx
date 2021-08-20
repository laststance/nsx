import React, { memo } from 'react'

import { formatDate } from '../utils'

const DateDisplay = memo<{ date: string }>(
  ({ date }) => {
    return (
      <div className="text-lg text-gray-500 w-24 text-center flex-initial">
        {formatDate(date)}
      </div>
    )
  },
  () => true
)

DateDisplay.displayName = 'DateDisplay'

export default DateDisplay
