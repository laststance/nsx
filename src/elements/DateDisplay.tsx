import { formatDate } from '../utils'
import React from 'react'

const DateDisplay: React.FC<{ date: string }> = ({ date }) => {
  return (
    <div className="text-lg text-gray-500 w-24 text-center">
      {formatDate(date)}
    </div>
  )
}

export default React.memo(DateDisplay, () => true)
