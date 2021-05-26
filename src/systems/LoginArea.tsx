import React, { PropsWithChildren } from 'react'
import { Redirect, RouteComponentProps } from '@reach/router'
import { ReduxState } from '../redux'
import { useSelector } from 'react-redux'

const LoginArea: React.FC<RouteComponentProps> = ({ children }) => {
  const login: ReduxState['login'] = useSelector<
    ReduxState,
    ReduxState['login']
  >((state) => state.login)

  return login ? <>{children}</> : <Redirect to="/login" noThrow />
}

export default React.memo<PropsWithChildren<RouteComponentProps>>(LoginArea)
