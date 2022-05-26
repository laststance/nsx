import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'

import NotFound from '../pages/NotFound/index'
import { selectLogin } from '../redux/adminSlice'
import { useAppSelector } from '../redux/hooks'

const Private: React.FC = memo(() => {
  const login = useAppSelector(selectLogin)

  return login ? <Outlet /> : <NotFound />
})
Private.displayName = 'Private'

export default Private
