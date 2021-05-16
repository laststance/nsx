import { Action, Reducer, createStore } from 'redux'

export interface ReduxState {
  isLogin: boolean
}

export interface LoginAction extends Action<'LOGIN'> {
  type: 'LOGIN'
}

export interface LogoutAction extends Action<'LOGOUT'> {
  type: 'LOGOUT'
}

type MyAppAction = LoginAction | LogoutAction

const reducer: Reducer<ReduxState | undefined, MyAppAction> = (
  state = { isLogin: false },
  action
) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLogin: true }

    case 'LOGOUT':
      return { ...state, isLogin: false }

    default:
      return state
  }
}

export const store = createStore(
  reducer,
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
