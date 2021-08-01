import React, { memo } from 'react'
import type { RouteComponentProps } from '@reach/router'
import Layout from '../components/Layout'

const NotFound = memo<RouteComponentProps>(
  () => (
    <Layout className="flex justify-center items-center">
      <h1 className="text-6xl">Page Not Found</h1>
    </Layout>
  ),
  () => true
)

NotFound.displayName = 'NotFound'

export default NotFound
