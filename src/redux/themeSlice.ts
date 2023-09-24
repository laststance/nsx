import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  value: Theme
}

const initialState: ThemeState = {
  value: 'system',
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<Theme>) => {
      state.value = action.payload
    },
  },
})

export const selectTheme = (state: RootState): Theme => state.theme.value

export const { updateTheme } = themeSlice.actions

export default themeSlice.reducer
