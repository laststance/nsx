import { Link } from '@reach/router'
import React from 'react'

import Button from '../../elements/Button'
import type { AdminState } from '../../redux/adminSlice'

interface Props {
  login: AdminState['login']
}

const AdminControlPanel: React.FC<Props> = (props: { login: boolean }) => {
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
        <Button variant="secondary" data-cy="logout-btn">
          Logout
        </Button>
      )}
    </div>
  )
}

export default AdminControlPanel
