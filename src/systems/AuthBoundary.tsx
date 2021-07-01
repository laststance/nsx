import React, { PropsWithChildren } from 'react'
import { Redirect, RouteComponentProps } from '@reach/router'
import { useAppSelector } from '../redux/hooks'
import { selectLogin } from '../redux/adminSlice'

const AuthBoundary: React.FC<RouteComponentProps> = ({ children }) => {
  const login = useAppSelector(selectLogin)

  return login ? <>{children}</> : <Redirect to="/login" noThrow />
}

export default React.memo<PropsWithChildren<RouteComponentProps>>(AuthBoundary)
