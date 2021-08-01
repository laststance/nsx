import React, { memo } from 'react'
import type { RouteComponentProps } from '@reach/router'
import { Redirect } from '@reach/router'
import { useAppSelector } from '../redux/hooks'
import { selectLogin } from '../redux/adminSlice'

const AdminRoutes: React.FC<RouteComponentProps> = memo(({ children }) => {
  const login = useAppSelector(selectLogin)

  return login ? <>{children}</> : <Redirect to="/login" noThrow />
})

export default AdminRoutes
