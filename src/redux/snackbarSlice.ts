import { createSlice } from '@reduxjs/toolkit'
import { SnackBarMessage } from '../../DataStructure'

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    snackbarQueue: [],
  },
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
