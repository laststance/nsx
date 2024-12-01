import React, { memo } from 'react'
import { Outlet as AuthorizedApp } from 'react-router'

import NotFound from '../pages/NotFound'
import { selectLogin } from '../redux/adminSlice'
import { useAppSelector } from '../redux/hooks'

const AuthRouter: React.FC = memo(() => {
  const login = useAppSelector(selectLogin)

  // @TODO add JWT Token validation?

  return login ? <AuthorizedApp /> : <NotFound />
})
AuthRouter.displayName = 'HeadlessEffect.AuthRouter'

export default AuthRouter
