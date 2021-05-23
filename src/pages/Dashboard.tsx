import React from 'react'
import { RouteComponentProps } from '@reach/router'
import Layout from '../components/Layout'

const Dashboard: React.FC<RouteComponentProps> = () => {
  // @TODO post list

  return (
    <Layout>
      <h1 className="text-3xl mb-3">Dashbord</h1>
      <button>Create</button>
    </Layout>
  )
}

export default Dashboard
