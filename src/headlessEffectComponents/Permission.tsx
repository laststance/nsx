import React, { memo } from 'react'
import { Outlet as AuthorizedApp } from 'react-router-dom'

import NotFound from '../pages/NotFound'
import { selectLogin } from '../redux/adminSlice'
import { useAppSelector } from '../redux/hooks'

const Permission: React.FC = memo(() => {
  const login = useAppSelector(selectLogin)

  // @TODO add JWT Token validation?

  return login ? <AuthorizedApp /> : <NotFound />
})
Permission.displayName = 'HeadlessEffect.Permission'

export default Permission
