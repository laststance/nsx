import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    login: false,
    author: '',
  },
  reducers: {
    login: (state, action) => {
      state.login = true
      state.author = action.payload.author
    },
  },
})
