import React from 'react'
import { RouteComponentProps } from '@reach/router'
import Layout from '../components/Layout'

const NotFound: React.FC<RouteComponentProps> = () => (
  <Layout className="flex justify-center items-center">
    <h1 className="text-6xl">Page Not Found</h1>
  </Layout>
)

export default React.memo(NotFound, () => true)
