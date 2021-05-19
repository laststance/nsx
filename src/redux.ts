import { Action, Reducer, createStore } from 'redux'
import { SnackBarMessage } from '../DataStructure'

/**
 * ============================================================
 * State
 * ============================================================
 */
export interface ReduxState {
  isNewSignup: boolean
  isLogin: boolean
  snackbarQueue: SnackBarMessage[]
}

const initialState: ReduxState = {
  isNewSignup: false,
  isLogin: false,
  snackbarQueue: [],
}

/**
 * ============================================================
 * Actions
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
  state = initialState,
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

/**
 * ============================================================
 * Create Store
 * ============================================================
 */
export const store = createStore(
  reducer,
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
