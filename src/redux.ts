import { Action, Reducer, createStore } from 'redux'

/**
 * ============================================================
 * State
 * ============================================================
 */
export interface ReduxState {
  isNewSignup: boolean
  isLogin: boolean
}

/**
 * ============================================================
 * Action
 * ============================================================
 */
export type SuccessSignupAction = Action<'SUCCESS_SIGNUP'>

export type CloseSignupSnackbarAction = Action<'CLOSE_SIGINUP_SNACKBAR'>

export type LoginAction = Action<'LOGIN'>

export type LogoutAction = Action<'LOGOUT'>

type ReduxAction =
  | LoginAction
  | LogoutAction
  | SuccessSignupAction
  | CloseSignupSnackbarAction

/**
 * ============================================================
 * Reducer
 * ============================================================
 */
const reducer: Reducer<ReduxState | undefined, ReduxAction> = (
  state = { isNewSignup: false, isLogin: false },
  action
) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLogin: true }

    case 'LOGOUT':
      return { ...state, isLogin: false }

    case 'SUCCESS_SIGNUP':
      return { ...state, isNewSignup: true }

    case 'CLOSE_SIGINUP_SNACKBAR':
      return { ...state, isNewSignup: false }

    default:
      return state
  }
}

export const store = createStore(
  reducer,
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
