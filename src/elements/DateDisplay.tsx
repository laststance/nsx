import { formatDate } from '../utils'
import React from 'react'

const DateDisplay = React.memo<{ date: string }>(
  ({ date }) => {
    return (
      <div className="text-lg text-gray-500 w-24 text-center flex-initial">
        {formatDate(date)}
      </div>
    )
  },
  () => true
)

export default DateDisplay
