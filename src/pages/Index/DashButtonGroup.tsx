import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button/Button'
import type { AdminState } from '../../redux/adminSlice'
import { logout, selectLogin } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { useAppSelector } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault()
  const response = await dispatch(API.endpoints.logoutRequest.initiate())

  if (isSuccess(response) && 'data' in response) {
    dispatch(logout())
    dispatch(enqueSnackbar({ color: 'green', message: response.data.message }))
  }
}

const DashButtonGroup: React.FC = memo(() => {
  const login: AdminState['login'] = useAppSelector(selectLogin)
  if (login === false) return null

  return (
    <div className="flex items-center justify-around py-10">
      <Link to="/dashboard">
        <Button variant="primary" data-cy="dashoard-page-transition-link-btn">
          Dashboard
        </Button>
      </Link>
      <Button variant="secondary" data-cy="logout-btn" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
})
DashButtonGroup.displayName = 'AdminControlPanel'

export default DashButtonGroup
