import type React from 'react'

import { logout } from './redux/adminSlice'
import { API } from './redux/API'
import isSuccess from './redux/helper/isSuccess'
import { enqueSnackbar } from './redux/snackbarSlice'
import { dispatch } from './redux/store'

export async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault()
  const response = await dispatch(API.endpoints.logoutRequest.initiate())

  if (isSuccess(response) && 'data' in response) {
    dispatch(logout())
    dispatch(enqueSnackbar({ color: 'green', message: response.data.message }))
  }
}
