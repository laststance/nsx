import type { RouteComponentProps } from '@reach/router'
import { Redirect } from '@reach/router'
import React, { memo } from 'react'

import { selectLogin } from '../redux/adminSlice'
import { useAppSelector } from '../redux/hooks'

const AdminRoutes: React.FC<RouteComponentProps> = memo(({ children }) => {
  const login = useAppSelector(selectLogin)

  return login ? <>{children}</> : <Redirect to="/login" noThrow />
})

AdminRoutes.displayName = 'AdminRoutes'

export default AdminRoutes
