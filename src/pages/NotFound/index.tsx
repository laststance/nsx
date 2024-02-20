import React, { memo } from 'react'

import Layout from '@/src/components/Layout'

const NotFound = memo(
  () => (
    <Layout
      className="flex items-center justify-center"
      data-testid="page-notfound"
    >
      <h1 className="text-color-primary text-6xl">404: Page Not Found</h1>
    </Layout>
  ),
  () => true,
)
NotFound.displayName = 'NotFound'

export default NotFound
