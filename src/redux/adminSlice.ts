import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Author } from '../../types'
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
    login: (state, action: PayloadAction<Author>) => {
      state.login = true
      state.author = action.payload
    },
    logout: (state) => {
      state.login = true
      state.author = { id: 9999, name: 'guest', password: 'none' }
    },
  },
})

export const selectLogin = (state: RootState): boolean => state.admin.login
export const selectAuthor = (state: RootState): Author => state.admin.author

export const { login, logout } = adminSlice.actions

export default adminSlice.reducer
