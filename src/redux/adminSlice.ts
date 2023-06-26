import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export interface AdminState {
  login: boolean
  author: Author
}

const initialState = {
  author: {
    createdAt: 'none',
    id: 9999,
    name: 'guest',
    password: 'none',
    updatedAt: 'none',
  },
  login: false,
}

export const adminSlice = createSlice({
  initialState,
  name: 'admin',
  reducers: {
    login: (state, action: PayloadAction<Author>) => {
      state.login = true
      state.author = action.payload
    },
    logout: (state) => {
      state.login = false
      state.author = initialState.author
    },
  },
})

export const selectLogin = (state: RootState): AdminState['login'] =>
  state.admin.login
export const selectAuthor = (state: RootState): AdminState['author'] =>
  state.admin.author

export const { login, logout } = adminSlice.actions

export default adminSlice.reducer
