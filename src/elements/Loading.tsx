import React, { memo } from 'react'
import { CircleLoader } from 'react-spinners'

export const Loading = memo(
  () => {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <CircleLoader size={250} color="#36D7B7" />
      </div>
    )
  },
  () => true
)
