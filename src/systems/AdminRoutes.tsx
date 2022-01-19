import React, { memo } from 'react'

import { selectLogin } from '../redux/adminSlice'
import { useAppSelector } from '../redux/hooks'
import Redirect from '../systems/Redirect'

const AdminRoutes: React.FC = memo(({ children }) => {
  const login = useAppSelector(selectLogin)

  return login ? <>{children}</> : <Redirect to="/login" />
})
AdminRoutes.displayName = 'AdminRoutes'

export default AdminRoutes
