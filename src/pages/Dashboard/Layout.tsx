import React, { memo } from 'react'

import BaseLayout from '../../components/Layout'

const Layout: React.FC = memo(({ children, ...rest }) => (
  <BaseLayout
    disableBaseStyle
    className="sm:w-full lg:container flex flex-col justify-start flex-grow px-4 py-4 mx-auto"
    data-cy="dashboard-page-content-root"
    {...rest}
  >
    {children}
  </BaseLayout>
))
Layout.displayName = 'Layout'

export default Layout
