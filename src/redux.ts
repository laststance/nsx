import { Action, Reducer, createStore } from 'redux'

export interface ReduxState {
  isSignup: boolean
  isLogin: boolean
}

export interface SignupAction extends Action<'SIGNUP'> {
  type: 'SIGNUP'
}

export interface CloseSignupSnackbarAction
  extends Action<'CLOSE_SIGINUP_SNACKBAR'> {
  type: 'CLOSE_SIGINUP_SNACKBAR'
}

export interface LoginAction extends Action<'LOGIN'> {
  type: 'LOGIN'
}

export interface LogoutAction extends Action<'LOGOUT'> {
  type: 'LOGOUT'
}

type MyAppAction =
  | LoginAction
  | LogoutAction
  | SignupAction
  | CloseSignupSnackbarAction

const reducer: Reducer<ReduxState | undefined, MyAppAction> = (
  state = { isSignup: false, isLogin: false },
  action
) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLogin: true }

    case 'LOGOUT':
      return { ...state, isLogin: false }
    case 'SIGNUP':
      return { ...state, isSignup: true }
    case 'CLOSE_SIGINUP_SNACKBAR':
      return { ...state, isSignup: false }
    default:
      return state
  }
}

export const store = createStore(
  reducer,
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
