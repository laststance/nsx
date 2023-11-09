import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export interface SnackBarMessage {
  color: 'red' | 'green'
  message: string
}

export interface SnackBarState {
  snackbarQueue: Array<SnackBarMessage>
}

const initialState: SnackBarState = {
  snackbarQueue: [],
}

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    dequeSnackbar: (state) => {
      state.snackbarQueue.shift()
    },
    enqueSnackbar: (state, action: PayloadAction<SnackBarMessage>) => {
      const message: SnackBarMessage['message'] = action.payload.message
      const color: SnackBarMessage['color'] = action.payload.color
      const newMessage: SnackBarMessage = { color, message }
      state.snackbarQueue.push(newMessage)
    },
  },
})

export const selectMessageQueue = (state: RootState): Array<SnackBarMessage> =>
  state.snackbar.snackbarQueue

export const { dequeSnackbar, enqueSnackbar } = snackbarSlice.actions

export default snackbarSlice.reducer
