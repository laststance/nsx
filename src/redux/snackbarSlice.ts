import { createSlice } from '@reduxjs/toolkit'
import { SnackBarMessage } from '../../DataStructure'

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
    enque: (state, action) => {
      const message: SnackBarMessage['message'] = action.payload.message
      const color: SnackBarMessage['color'] = action.payload.color
      const newMessage: SnackBarMessage = { message, color }
      // @ts-ignore
      state.snackbarQueue.push(newMessage)
    },
    deque: (state) => {
      state.snackbarQueue.pop()
    },
  },
})

export const { enque, deque } = snackbarSlice.actions

export default snackbarSlice.reducer
