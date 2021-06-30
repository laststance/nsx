import { createSlice } from '@reduxjs/toolkit'
import { Author } from '../../DataStructure'
import { RootState } from './store'

export interface AdminState {
  login: boolean
  author: Author
}

const initialState = {
  login: false,
  // @TODO author field will delte in the future
  author: { id: 9999, name: 'guest', password: 'none' },
}

export const adminSlice = createSlice({
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

export const selectLogin = (state: RootState): boolean => state.admin.login

export const { login, logout } = adminSlice.actions

export default adminSlice.reducer
