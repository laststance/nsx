import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

const SnackBarContainer: React.FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <div className="z-60 fixed right-0 top-0 bg-transparent flex flex-col w-fit">
      {children}
    </div>
  )
})
SnackBarContainer.displayName = 'SnackBarContainer'

export default SnackBarContainer
