import React, { memo } from 'react'

import BaseLayout from '../../components/Layout'

const Layout: React.FC<React.PropsWithChildren<_>> = memo(
  ({ children, ...rest }) => (
    <BaseLayout
      disableBaseStyle
      className="mx-auto flex flex-grow flex-col justify-start px-4 py-4 sm:w-full lg:container"
      data-cy="dashboard-page-content-root"
      {...rest}
    >
      {children}
    </BaseLayout>
  )
)
Layout.displayName = 'Layout'

export default Layout
