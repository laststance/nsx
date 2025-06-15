import React, { memo } from 'react'
import { Outlet as AuthorizedApp, Navigate } from 'react-router'

import { selectLogin } from '../redux/adminSlice'
import { useAppSelector } from '../redux/hooks'

const AuthRouter: React.FC = memo(() => {
  const login = useAppSelector(selectLogin)

  return login ? <AuthorizedApp /> : <Navigate to="/" replace />
})
AuthRouter.displayName = 'AuthRouter'

export default AuthRouter
