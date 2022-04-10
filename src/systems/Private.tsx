import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { selectLogin } from '../redux/adminSlice'
import { useAppSelector } from '../redux/hooks'
import Redirect from '../systems/Redirect'

const Private: React.FC<React.PropsWithChildren<unknown>> = memo(() => {
  const login = useAppSelector(selectLogin)

  return login ? <Outlet /> : <Redirect to="/login" />
})
Private.displayName = 'Private'

export default Private
