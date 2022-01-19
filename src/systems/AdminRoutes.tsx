import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { selectLogin } from '../redux/adminSlice'
import { useAppSelector } from '../redux/hooks'
import Redirect from '../systems/Redirect'

const AdminRoutes: React.FC = memo(() => {
  const login = useAppSelector(selectLogin)

  return login ? <Outlet /> : <Redirect to="/login" />
})
AdminRoutes.displayName = 'AdminRoutes'

export default AdminRoutes
