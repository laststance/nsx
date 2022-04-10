import React, { memo } from 'react'
import { CircleLoader } from 'react-spinners'

const Loading: React.FC<React.PropsWithChildren<unknown>> = memo(
  () => {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <CircleLoader size={250} color="#9CA3AF" />
      </div>
    )
  },
  () => true
)
Loading.displayName = 'Loading'

export default Loading
