import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: 'system',
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<{ theme: Theme }>) => {
      state.theme = action.payload.theme
    },
  },
})

export const selectTheme = (state: RootState): ThemeState => state.theme

export const { updateTheme } = themeSlice.actions

export default themeSlice.reducer
