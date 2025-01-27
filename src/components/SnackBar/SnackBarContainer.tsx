import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

const SnackBarContainer: React.FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <div className="fixed top-0 right-0 z-60 flex w-fit flex-col bg-transparent">
      {children}
    </div>
  )
})
SnackBarContainer.displayName = 'SnackBarContainer'

export default SnackBarContainer
