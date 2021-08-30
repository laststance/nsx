import { Link } from '@reach/router'
import React, { useState } from 'react'

import type { LogoutResponse } from '../../../types'
import Button from '../../elements/Button'
import type { AdminState } from '../../redux/adminSlice'
import { logout } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppDispatch } from '../../redux/hooks'
import { enque } from '../../redux/snackbarSlice'

interface Props {
  login: AdminState['login']
}

const AdminControlPanel: React.FC<Props> = (props: { login: boolean }) => {
  const [loging, setLoading] = useState(false)
  const [logoutRequest] = API.endpoints.logoutRequest.useMutation()
  const dispatch = useAppDispatch()

  async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    try {
      setLoading(true)

      const response: LogoutResponse = await logoutRequest().unwrap()

      dispatch(logout())
      dispatch(enque({ message: response.message, color: 'green' }))
    } catch (error) {
      dispatch(enque({ message: error.status, color: 'red' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-around py-10">
      {!props.login && process.env.REACT_APP_ENABLE_LOGIN && (
        <Link to="/login">
          <Button variant="primary" data-cy="login-btn">
            Login
          </Button>
        </Link>
      )}
      {!props.login && process.env.REACT_APP_ENABLE_SIGNUP && (
        <Link to="/signup">
          <Button variant="primary" data-cy="signup-btn">
            Sigunup
          </Button>
        </Link>
      )}
      {props.login && (
        <Link to="/dashboard">
          <Button variant="primary" data-cy="dashboard-btn">
            Dashboard
          </Button>
        </Link>
      )}
      {props.login && (
        <Button
          variant="secondary"
          data-cy="logout-btn"
          onClick={handleLogout}
          isLoading={loging}
        >
          Logout
        </Button>
      )}
    </div>
  )
}

export default AdminControlPanel
