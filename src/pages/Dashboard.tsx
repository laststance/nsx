import React, { useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import Layout from '../components/Layout'

const Dashboard: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    // @TODO impl popup and close redux state
  }, [])

  return (
    <Layout>
      <h1>Dashbord</h1>
      <button>Create</button>
    </Layout>
  )
}

export default Dashboard
