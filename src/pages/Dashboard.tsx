import React, { useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import { CloseSignupSnackbarAction, LoginAction } from '../redux'
import Layout from '../components/Layout'

const Dashboard: React.FC<RouteComponentProps> = () => {
  const dispatch: Dispatch<CloseSignupSnackbarAction | LoginAction> =
    useDispatch()

  useEffect(() => {
    // @TODO impl popup and close redux state
    // show snackbar
    // show off snackbar
    dispatch({ type: 'CLOSE_SIGINUP_SNACKBAR' })
    // set login true into the ReduxState
    dispatch({ type: 'LOGIN' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <h1>Dashbord</h1>
      <button>Create</button>
    </Layout>
  )
}

export default Dashboard
