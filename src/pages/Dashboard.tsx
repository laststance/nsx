import React, { useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import Layout from '../components/Layout'

const Dashboard: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    // @TODO impl popup and close redux state
  }, [])

  return <Layout>dashbord</Layout>
}

export default Dashboard
