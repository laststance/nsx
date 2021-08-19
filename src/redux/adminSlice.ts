import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { Author } from '../../types'
import type { RootState } from './store'

export interface AdminState {
  login: boolean
  author: Author
}

const initialState = {
  login: false,
  author: {
    id: 9999,
    name: 'guest',
    password: 'none',
    createdAt: 'none',
    updatedAt: 'none',
  },
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
      state.author = initialState.author
    },
  },
})

export const selectLogin = (state: RootState): boolean => state.admin.login
export const selectAuthor = (state: RootState): Author => state.admin.author

export const { login, logout } = adminSlice.actions

export default adminSlice.reducer
