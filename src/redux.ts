import { Action, Reducer, createStore } from 'redux'
import ImmutableArray from '../lib/immutableArray'
import { SnackBarMessage } from '../DataStructure'

/**
 * ============================================================
 * State
 * ============================================================
 */
export interface ReduxState {
  login: boolean
  snackbarQueue: SnackBarMessage[]
}

const initialState: ReduxState = {
  login: false,
  snackbarQueue: [],
}

/**
 * ============================================================
 * Actions
 * ============================================================
 */

export type LoginAction = Action<'LOGIN'>

export type LogoutAction = Action<'LOGOUT'>

export interface EnqueueSnackbarAction
  extends Action<'ENQUEUE_SNACKBAR_MESSAGE'> {
  payload: { message: string }
}

export type DequeueSnackbarAction = Action<'DEQUEUE_SNACKBAR_MESSAGE'>

export type ReduxAction =
  | LoginAction
  | LogoutAction
  | EnqueueSnackbarAction
  | DequeueSnackbarAction

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
      return { ...state, login: true }

    case 'LOGOUT':
      return { ...state, login: false }

    case 'ENQUEUE_SNACKBAR_MESSAGE':
      const queue = state.snackbarQueue
      const message = action.payload.message
      const enqueuedMessages = ImmutableArray.unshift(queue, message)

      return { ...state, snackbarQueue: enqueuedMessages }

    case 'DEQUEUE_SNACKBAR_MESSAGE':
      const [, firstItemRemovedArray] = ImmutableArray.pop(state.snackbarQueue)
      return { ...state, snackbarQueue: firstItemRemovedArray }

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
