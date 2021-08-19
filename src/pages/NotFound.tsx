import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Layout from '../components/Layout'

const NotFound = memo<RouteComponentProps>(
  () => (
    <Layout className="flex justify-center items-center">
      <h1 className="text-6xl">404: Page Not Found</h1>
    </Layout>
  ),
  () => true
)

NotFound.displayName = 'NotFound'

export default NotFound
