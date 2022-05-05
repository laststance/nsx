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
    updateTheme: (state, action: PayloadAction<{ theme: Theme }>) => {
      state.value = action.payload.theme
    },
  },
})

export const selectTheme = (state: RootState): Theme => state.value

export const { updateTheme } = themeSlice.actions

export default themeSlice.reducer
