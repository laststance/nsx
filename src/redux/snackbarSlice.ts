import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export interface SnackBarMessage {
  id: number
  color: 'red' | 'green'
  message: string
}

export interface SnackBarState {
  nextId: number
  snackbarQueue: Array<SnackBarMessage>
}

const initialState: SnackBarState = {
  nextId: 0,
  snackbarQueue: [],
}
export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    dequeSnackbar: (state, action: PayloadAction<SnackBarMessage['id']>) => {
      state.nextId--
      state.snackbarQueue = state.snackbarQueue.filter(
        (v) => v.id !== action.payload,
      )
    },
    enqueSnackbar: (
      state,
      action: PayloadAction<Omit<SnackBarMessage, 'id'>>,
    ) => {
      const message: SnackBarMessage['message'] = action.payload.message
      const color: SnackBarMessage['color'] = action.payload.color
      state.nextId++
      const newMessage: SnackBarMessage = { id: state.nextId, color, message }
      state.snackbarQueue.push(newMessage)
    },
  },
})

export const selectMessageQueue = (state: RootState): Array<SnackBarMessage> =>
  state.snackbar.snackbarQueue

export const { dequeSnackbar, enqueSnackbar } = snackbarSlice.actions

export default snackbarSlice.reducer
