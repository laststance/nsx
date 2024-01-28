import React, { memo } from 'react'
import { CircleLoader } from 'react-spinners'

const Loading: React.FC = memo(
  () => {
    return (
      <div
        className="h-screen w-full grid place-content-center"
        data-testid="loading"
      >
        <CircleLoader size={250} color="#9CA3AF" />
      </div>
    )
  },
  () => true,
)
Loading.displayName = 'Loading'

export default Loading
