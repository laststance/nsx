import React, { memo } from 'react'
import { Redirect, RouteComponentProps } from '@reach/router'
import { useAppSelector } from '../redux/hooks'
import { selectLogin } from '../redux/adminSlice'

const AdminRoute: React.FC<RouteComponentProps> = memo(({ children }) => {
  const login = useAppSelector(selectLogin)

  return login ? <>{children}</> : <Redirect to="/login" noThrow />
})

export default AdminRoute
