import React, { useState, memo } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../elements/Button'
import type { AdminState } from '../../redux/adminSlice'
import { logout } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { useAppDispatch } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

interface Props {
  login: AdminState['login']
}

const AdminControlPanel: React.FC<Props> = memo((props: { login: boolean }) => {
  const [loging, setLoading] = useState(false)
  const [logoutRequest] = API.endpoints.logoutRequest.useMutation()
  const dispatch = useAppDispatch()

  async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    setLoading(true)

    const response = await logoutRequest()

    if (isSuccess(response) && 'data' in response) {
      dispatch(logout())
      dispatch(
        enqueSnackbar({ message: response.data.message, color: 'green' })
      )
    }
    setLoading(false)
  }

  const LoginBtn: boolean = !props.login && !!process.env.VITE_ENABLE_LOGIN
  const SignupBtn: boolean = !props.login && !!process.env.VITE_ENABLE_SIGNUP
  const DashboardBtn: AdminState['login'] = props.login

  if (LoginBtn === false && SignupBtn === false && DashboardBtn === false) {
    return null
  }

  return (
    <div className="flex items-center justify-around py-10">
      {LoginBtn && (
        <Link to="/login">
          <Button variant="primary" data-cy="login-btn">
            Login
          </Button>
        </Link>
      )}
      {SignupBtn && (
        <Link to="/signup">
          <Button variant="secondary" data-cy="signup-btn">
            Sigunup
          </Button>
        </Link>
      )}
      {DashboardBtn && (
        <Link to="/dashboard">
          <Button variant="primary" data-cy="dashoard-page-transition-link-btn">
            Dashboard
          </Button>
        </Link>
      )}
      {DashboardBtn && (
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
})
AdminControlPanel.displayName = 'AdminControlPanel'

export default AdminControlPanel
