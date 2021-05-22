import React, { useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import { LoginAction } from '../redux'
import Layout from '../components/Layout'

const Dashboard: React.FC<RouteComponentProps> = () => {
  const dispatch: Dispatch<LoginAction> = useDispatch()

  useEffect(() => {
    dispatch({ type: 'LOGIN' })
  }, [dispatch])

  return (
    <Layout>
      <h1>Dashbord</h1>
      <button>Create</button>
    </Layout>
  )
}

export default Dashboard
