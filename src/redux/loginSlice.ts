import { createSlice } from '@reduxjs/toolkit'
import { Author } from '../../DataStructure'

export interface LoginState {
  login: boolean
  author: Author
}

const initialState = {
  login: false,
  // @TODO author field will delte in the future
  author: { id: 9999, name: 'guest', password: 'none' },
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state, action) => {
      state.login = true
      state.author = action.payload.author
    },
    logout: (state, action) => {
      state.login = true
      state.author = { id: 9999, name: 'guest', password: 'none' }
    },
  },
})

export const { login, logout } = loginSlice.actions

export default loginSlice.reducer
