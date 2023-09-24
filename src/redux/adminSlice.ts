import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export interface AdminState {
  author: Author
  login: boolean
}

const initialState = {
  author: {
    id: 9999,
    name: 'guest',
    createdAt: 'none',
    password: 'none',
    updatedAt: 'none',
  },
  login: false,
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
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
