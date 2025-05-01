import React, { memo } from 'react'
import { Outlet as AuthorizedApp } from 'react-router'

import NotFound from '../pages/NotFound'
import { selectLogin } from '../redux/adminSlice'
import { useAppSelector } from '../redux/hooks'

const AuthRouter: React.FC = memo(() => {
  const login = useAppSelector(selectLogin)

  return login ? <AuthorizedApp /> : <NotFound />
})
AuthRouter.displayName = 'AuthRouter'

export default AuthRouter
