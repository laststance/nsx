import React, { memo } from 'react'

import { formatDate } from '../lib/formatDate'

const DateDisplay = memo<{ date: string }>(
  ({ date }) => {
    return (
      <div className="flex-initial w-24 text-lg text-center text-gray-500">
        {formatDate(date)}
      </div>
    )
  },
  () => true
)

DateDisplay.displayName = 'DateDisplay'

export default DateDisplay
